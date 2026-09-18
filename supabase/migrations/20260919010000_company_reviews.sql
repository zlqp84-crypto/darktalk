begin;
-- Raw reviews are private: only narrowly shaped RPC responses leave this table.
create table public.company_reviews (
 id uuid primary key default gen_random_uuid(),
 company_id uuid not null references public.companies(id),
 user_id uuid not null references auth.users(id) on delete cascade,
 rating integer not null check(rating between 1 and 5),
 title text not null check(char_length(btrim(title)) between 5 and 100),
 pros text not null check(char_length(btrim(pros)) between 30 and 3000),
 cons text not null check(char_length(btrim(cons)) between 30 and 3000),
 status text not null default 'pending' check(status in ('pending','approved','rejected','withdrawn')),
 created_at timestamptz not null default now(),
 approved_at timestamptz,
 access_until timestamptz,
 unique(company_id,user_id)
);
create index company_reviews_public_idx on public.company_reviews(company_id,approved_at desc,id) where status='approved';
create index company_reviews_access_idx on public.company_reviews(user_id,access_until) where status='approved';
alter table public.company_reviews enable row level security;
revoke all on public.company_reviews from public,anon,authenticated;
grant all on public.company_reviews to service_role;
-- No browser SELECT policy: authorship cannot be queried, joined, or inferred via filters.
create function public.submit_company_review(p_company_id uuid,p_rating integer,p_title text,p_pros text,p_cons text)
returns uuid language plpgsql security definer set search_path='' as $$
declare result uuid;
begin
 if auth.uid() is null then raise exception 'Login required' using errcode='42501'; end if;
 -- Serialize per-author submissions to enforce rate limit under concurrency.
 perform pg_advisory_xact_lock(hashtextextended(auth.uid()::text,0));
 if not exists(select 1 from public.companies where id=p_company_id and is_published) then raise exception 'Company unavailable' using errcode='22023'; end if;
 if exists(select 1 from public.company_reviews where user_id=auth.uid() and created_at>now()-interval '24 hours') then raise exception 'One submission per 24 hours' using errcode='22023'; end if;
 insert into public.company_reviews(company_id,user_id,rating,title,pros,cons) values(p_company_id,auth.uid(),p_rating,btrim(p_title),btrim(p_pros),btrim(p_cons)) on conflict(company_id,user_id) do update set rating=excluded.rating,title=excluded.title,pros=excluded.pros,cons=excluded.cons,status='pending',created_at=now(),approved_at=null,access_until=null where company_reviews.status in ('rejected','withdrawn') returning id into result;
 if result is null then raise exception 'Review already submitted' using errcode='22023'; end if;
 return result;
end $$;
create function public.company_review_access()
returns timestamptz language sql stable security definer set search_path='' as $$
 select max(access_until) from public.company_reviews where user_id=auth.uid() and status='approved' and access_until>now()
$$;
create function public.list_company_reviews(p_company_id uuid,p_offset integer default 0)
returns table(id uuid,rating integer,title text,pros text,cons text,published_on date)
language plpgsql stable security definer set search_path='' as $$
begin
 if auth.uid() is null or public.company_review_access() is null then raise exception 'Review access required' using errcode='42501'; end if;
 return query select r.id,r.rating,r.title,r.pros,r.cons,(r.approved_at at time zone 'Asia/Seoul')::date from public.company_reviews r join public.companies c on c.id=r.company_id where r.company_id=p_company_id and c.is_published and r.status='approved' order by r.approved_at desc,r.id limit 21 offset greatest(0,least(coalesce(p_offset,0),10000));
end $$;
create function public.my_company_reviews()
returns table(id uuid,company_id uuid,company_name text,rating integer,title text,pros text,cons text,status text,access_until timestamptz)
language sql stable security definer set search_path='' as $$
 select r.id,r.company_id,c.name,r.rating,r.title,r.pros,r.cons,r.status,r.access_until from public.company_reviews r join public.companies c on c.id=r.company_id where r.user_id=auth.uid() order by r.created_at desc limit 50
$$;
create function public.withdraw_company_review(p_id uuid)
returns void language plpgsql security definer set search_path='' as $$
begin
 if auth.uid() is null then raise exception 'Login required' using errcode='42501'; end if;
 update public.company_reviews set status='withdrawn',access_until=null where id=p_id and user_id=auth.uid();
end $$;
create function public.admin_company_reviews(p_status text default 'pending',p_offset integer default 0)
returns table(id uuid,company_name text,rating integer,title text,pros text,cons text,status text)
language plpgsql stable security definer set search_path='' as $$
begin
 perform public.require_admin_aal2();
 return query select r.id,c.name,r.rating,r.title,r.pros,r.cons,r.status from public.company_reviews r join public.companies c on c.id=r.company_id where r.status=p_status order by r.created_at,r.id limit 50 offset greatest(0,least(coalesce(p_offset,0),10000));
end $$;
create function public.moderate_company_review(p_id uuid,p_decision text)
returns void language plpgsql security definer set search_path='' as $$
declare r public.company_reviews;
begin
 perform public.require_admin_aal2();
 if p_decision not in ('approved','rejected') or p_decision is null then raise exception 'Invalid decision' using errcode='22023'; end if;
 select * into r from public.company_reviews where id=p_id for update;
 if not found or r.status='withdrawn' then raise exception 'Review unavailable' using errcode='22023'; end if;
 if r.user_id=auth.uid() then raise exception 'Cannot moderate own review' using errcode='42501'; end if;
 if p_decision='approved' and r.status<>'pending' then raise exception 'Only pending reviews can be approved' using errcode='22023'; end if;
 update public.company_reviews set status=p_decision,approved_at=case when p_decision='approved' then now() else approved_at end,access_until=case when p_decision='approved' then now()+interval '90 days' else null end where id=p_id;
end $$;
revoke all on function public.submit_company_review(uuid,integer,text,text,text),public.company_review_access(),public.list_company_reviews(uuid,integer),public.my_company_reviews(),public.withdraw_company_review(uuid),public.admin_company_reviews(text,integer),public.moderate_company_review(uuid,text) from public,anon,authenticated,service_role;
grant execute on function public.submit_company_review(uuid,integer,text,text,text),public.company_review_access(),public.list_company_reviews(uuid,integer),public.my_company_reviews(),public.withdraw_company_review(uuid),public.admin_company_reviews(text,integer),public.moderate_company_review(uuid,text) to authenticated;
notify pgrst,'reload schema';
commit;

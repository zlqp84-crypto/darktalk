-- Public table inventory confirmed 2026-09-22: no existing report table.
begin;
create table public.content_reports (
 id uuid primary key default gen_random_uuid(),
 reporter_id uuid not null references auth.users(id) on delete cascade,
 target_type text not null check(target_type in ('post','comment','review')),
 target_id uuid not null,
 reason text not null check(reason in ('privacy','abuse','spam','false_information','other')),
 details text not null default '' check(char_length(details)<=1000),
 status text not null default 'pending' check(status in ('pending','resolved','dismissed')),
 created_at timestamptz not null default now(),
 resolved_at timestamptz,
 unique(reporter_id,target_type,target_id)
);
create index content_reports_pending on public.content_reports(created_at,id) where status='pending';
create index content_reports_rate on public.content_reports(reporter_id,created_at);
alter table public.content_reports enable row level security;
revoke all on public.content_reports from public,anon,authenticated;
grant all on public.content_reports to service_role;

create function public.submit_content_report(p_target_type text,p_target_id uuid,p_reason text,p_details text default '')
returns uuid language plpgsql security definer set search_path='' as $$
declare result uuid; actor uuid:=auth.uid();
begin
 if actor is null then raise insufficient_privilege using message='Login required'; end if;
 perform public.ensure_my_profile();
 if p_target_type is null or p_target_type not in ('post','comment','review') then raise invalid_parameter_value using message='Invalid target'; end if;
 if p_reason is null or p_reason not in ('privacy','abuse','spam','false_information','other') or char_length(coalesce(p_details,''))>1000 then raise invalid_parameter_value using message='Invalid report'; end if;
 perform pg_advisory_xact_lock(hashtextextended(actor::text,2202));
 if p_target_type='post' and not exists(select 1 from public.posts where id=p_target_id) or
    p_target_type='comment' and not exists(select 1 from public.comments where id=p_target_id) or
    p_target_type='review' and (public.company_review_access() is null or not exists(select 1 from public.company_reviews r join public.companies c on c.id=r.company_id where r.id=p_target_id and r.status='approved' and c.is_published)) then
  raise invalid_parameter_value using message='Content unavailable';
 end if;
 select id into result from public.content_reports where reporter_id=actor and target_type=p_target_type and target_id=p_target_id;
 if found then return result; end if;
 if (select count(*) from public.content_reports where reporter_id=actor and created_at>now()-interval '24 hours')>=10 then raise invalid_parameter_value using message='Daily report limit'; end if;
 insert into public.content_reports(reporter_id,target_type,target_id,reason,details) values(actor,p_target_type,p_target_id,p_reason,btrim(coalesce(p_details,''))) returning id into result;
 return result;
end;
$$;
create function public.admin_content_reports(p_offset integer default 0)
returns table(id uuid,target_type text,target_id uuid,reason text,details text,created_at timestamptz,target_path text,target_content text)
language plpgsql stable security definer set search_path='' as $$
begin
 perform public.require_admin_aal2();
 return query select r.id,r.target_type,r.target_id,r.reason,r.details,r.created_at,
  case when p.id is not null then '/post/'||p.id::text when cm.id is not null then '/post/'||cm.post_id::text else null end,
  coalesce(p.title||E'\n'||p.content,cm.content,rv.title||E'\n'||rv.pros||E'\n'||rv.cons,'삭제된 콘텐츠')
 from public.content_reports r
 left join public.posts p on r.target_type='post' and p.id=r.target_id
 left join public.comments cm on r.target_type='comment' and cm.id=r.target_id
 left join public.company_reviews rv on r.target_type='review' and rv.id=r.target_id
 where r.status='pending' order by r.created_at,r.id limit 50 offset greatest(0,least(coalesce(p_offset,0),10000));
end;
$$;
create function public.resolve_content_report(p_id uuid,p_status text)
returns void language plpgsql security definer set search_path='' as $$
begin
 perform public.require_admin_aal2();
 if p_status is null or p_status not in ('resolved','dismissed') then raise invalid_parameter_value using message='Invalid decision'; end if;
 update public.content_reports set status=p_status,resolved_at=now() where id=p_id and status='pending';
end;
$$;
revoke all on function public.submit_content_report(text,uuid,text,text),public.admin_content_reports(integer),public.resolve_content_report(uuid,text) from public,anon;
grant execute on function public.submit_content_report(text,uuid,text,text),public.admin_content_reports(integer),public.resolve_content_report(uuid,text) to authenticated;
commit;

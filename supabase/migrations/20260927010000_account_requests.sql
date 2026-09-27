-- Storage objects must be removed through Storage API before Auth deletion.
begin;
create table public.account_deletion_requests (
 id uuid primary key default gen_random_uuid(),
 user_id uuid not null unique references auth.users(id) on delete cascade,
 status text not null default 'pending' check(status in ('pending','processing')),
 created_at timestamptz not null default now()
);
alter table public.account_deletion_requests enable row level security;
revoke all on public.account_deletion_requests from public,anon,authenticated;
grant all on public.account_deletion_requests to service_role;
create function public.request_account_deletion()
returns void language plpgsql security definer set search_path='' as $$
begin
 if auth.uid() is null then raise insufficient_privilege using message='Login required'; end if;
 perform public.ensure_my_profile();
 if exists(select 1 from public.profiles where id=auth.uid() and is_admin) then
  raise insufficient_privilege using message='Administrator must transfer responsibilities first';
 end if;
 insert into public.account_deletion_requests(user_id) values(auth.uid()) on conflict(user_id) do nothing;
end;
$$;
create function public.my_account_deletion_request()
returns table(status text,created_at timestamptz)
language sql stable security definer set search_path='' as $$
 select r.status,r.created_at from public.account_deletion_requests r where r.user_id=auth.uid();
$$;
create function public.cancel_account_deletion()
returns void language plpgsql security definer set search_path='' as $$
begin
 if auth.uid() is null then raise insufficient_privilege using message='Login required'; end if;
 delete from public.account_deletion_requests where user_id=auth.uid() and status='pending';
 if exists(select 1 from public.account_deletion_requests where user_id=auth.uid()) then raise exception 'Processing already started' using errcode='22023'; end if;
end;
$$;
create function public.admin_account_deletion_requests()
returns table(id uuid,status text,created_at timestamptz)
language plpgsql stable security definer set search_path='' as $$
begin
 perform public.require_admin_aal2();
 return query select r.id,r.status,r.created_at from public.account_deletion_requests r order by r.created_at,r.id limit 100;
end;
$$;
revoke all on function public.request_account_deletion(),public.my_account_deletion_request(),public.cancel_account_deletion(),public.admin_account_deletion_requests() from public,anon;
grant execute on function public.request_account_deletion(),public.my_account_deletion_request(),public.cancel_account_deletion(),public.admin_account_deletion_requests() to authenticated;
commit;

-- New private deduplication state: one timestamp per account/post, not an event log.
begin;
create table if not exists public.post_view_receipts (
 post_id uuid not null references public.posts(id) on delete cascade,
 user_id uuid not null references auth.users(id) on delete cascade,
 last_counted_at timestamptz not null default now(),
 primary key(post_id,user_id)
);
alter table public.post_view_receipts enable row level security;
revoke all on public.post_view_receipts from public,anon,authenticated;
create or replace function public.record_post_view(p_post_id uuid)
returns integer language plpgsql security definer set search_path='' as $$
declare actor uuid:=auth.uid(); changed integer; total integer;
begin
 if actor is null then
  select views_count into total from public.posts where id=p_post_id;
  return coalesce(total,0);
 end if;
 perform 1 from auth.users where id=actor and email_confirmed_at is not null and deleted_at is null;
 if not found then raise insufficient_privilege using message='Confirmed account required'; end if;
 perform 1 from public.posts where id=p_post_id for update;
 if not found then raise no_data_found using message='Post unavailable'; end if;
 insert into public.post_view_receipts(post_id,user_id) values(p_post_id,actor)
 on conflict(post_id,user_id) do update set last_counted_at=now()
 where post_view_receipts.last_counted_at <= now()-interval '24 hours';
 get diagnostics changed = row_count;
 update public.posts set views_count=coalesce(views_count,0)+changed where id=p_post_id returning views_count into total;
 return total;
end;
$$;
revoke all on function public.record_post_view(uuid) from public;
grant execute on function public.record_post_view(uuid) to anon,authenticated;
create or replace function public.increment_post_views(p_post_id uuid)
returns void language plpgsql security definer set search_path='' as $$
begin perform public.record_post_view(p_post_id); end;
$$;
revoke all on function public.increment_post_views(uuid) from public;
grant execute on function public.increment_post_views(uuid) to anon,authenticated;
commit;

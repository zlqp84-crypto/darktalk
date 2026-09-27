-- Production likes inspected 2026-09-22: id/post_id/user_id/created_at,
-- UNIQUE(post_id,user_id), FK posts ON DELETE CASCADE, FK profiles.
begin;
lock table public.likes,public.comments,public.posts in share row exclusive mode;
alter table public.likes enable row level security;
revoke all on public.likes from public,anon,authenticated;
drop policy if exists "본인 좋아요" on public.likes;

create or replace function public.set_post_like(p_post_id uuid,p_liked boolean)
returns jsonb language plpgsql security definer set search_path='' as $$
declare actor uuid := auth.uid(); result_count integer; changed integer;
begin
 if actor is null then raise insufficient_privilege using message='Login required'; end if;
 if p_liked is null then raise invalid_parameter_value using message='Like state required'; end if;
 perform public.ensure_my_profile();
 perform 1 from public.posts where id=p_post_id for update;
 if not found then raise no_data_found using message='Post unavailable'; end if;
 if p_liked then
  insert into public.likes(post_id,user_id) values(p_post_id,actor) on conflict(post_id,user_id) do nothing;
 else
  delete from public.likes where post_id=p_post_id and user_id=actor;
 end if;
 get diagnostics changed = row_count;
 update public.posts set likes_count=greatest(0,coalesce(likes_count,0)+
   case when p_liked then changed else -changed end)
 where id=p_post_id returning likes_count into result_count;
 return jsonb_build_object('liked',p_liked,'likes_count',result_count);
end;
$$;
create or replace function public.my_post_like(p_post_id uuid)
returns boolean language sql stable security definer set search_path='' as $$
 select auth.uid() is not null and exists(select 1 from public.likes where post_id=p_post_id and user_id=auth.uid());
$$;
revoke all on function public.set_post_like(uuid,boolean),public.my_post_like(uuid) from public,anon;
grant execute on function public.set_post_like(uuid,boolean),public.my_post_like(uuid) to authenticated;

-- Retain signatures for older tabs, but no client can change numeric totals.
create or replace function public.increment_post_likes(p_post_id uuid,p_delta integer)
returns void language plpgsql security definer set search_path='' as $$
begin
 if p_delta is null or p_delta not in(-1,1) then raise invalid_parameter_value using message='Invalid change'; end if;
 perform public.set_post_like(p_post_id,p_delta=1);
end;
$$;
revoke all on function public.increment_post_likes(uuid,integer) from public,anon;
grant execute on function public.increment_post_likes(uuid,integer) to authenticated;

create or replace function public.sync_post_comment_count()
returns trigger language plpgsql security definer set search_path='' as $$
begin
 if TG_OP='INSERT' then
  update public.posts set comments_count=coalesce(comments_count,0)+1 where id=NEW.post_id;
 elsif TG_OP='DELETE' then
  update public.posts set comments_count=greatest(0,coalesce(comments_count,0)-1) where id=OLD.post_id;
 elsif NEW.post_id is distinct from OLD.post_id then
  update public.posts set comments_count=greatest(0,coalesce(comments_count,0)-1) where id=OLD.post_id;
  update public.posts set comments_count=coalesce(comments_count,0)+1 where id=NEW.post_id;
 end if;
 return null;
end;
$$;
revoke all on function public.sync_post_comment_count() from public,anon,authenticated;
drop trigger if exists sync_post_comment_count on public.comments;
create trigger sync_post_comment_count after insert or delete or update of post_id on public.comments
 for each row execute function public.sync_post_comment_count();
create or replace function public.increment_post_comments_count(p_post_id uuid,p_delta integer)
returns void language plpgsql set search_path='' as $$
begin
 -- Compatibility no-op: only the comments trigger maintains totals.
 return;
end;
$$;
revoke all on function public.increment_post_comments_count(uuid,integer) from public,anon;
grant execute on function public.increment_post_comments_count(uuid,integer) to authenticated;
-- Existing synthetic/anonymous like totals have no attributable reaction rows.
-- Preserve that historical baseline; only actual reaction changes adjust it.
update public.posts p set comments_count=(select count(*) from public.comments c where c.post_id=p.id);
commit;

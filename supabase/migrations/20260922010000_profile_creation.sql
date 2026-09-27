-- Confirmed production 2026-09-22: no auth.users triggers; profiles.nickname
-- is NOT NULL UNIQUE; two auth accounts lack profiles. Never trust metadata flags.
begin;

create or replace function public.ensure_my_profile()
returns void language plpgsql security definer set search_path = '' as $$
declare
  actor uuid := auth.uid();
  metadata jsonb;
  candidate text;
begin
  if actor is null then raise insufficient_privilege using message='Login required'; end if;
  perform pg_catalog.pg_advisory_xact_lock(pg_catalog.hashtextextended(actor::text, 2201));
  if exists(select 1 from public.profiles where id=actor) then return; end if;
  select raw_user_meta_data into metadata from auth.users
    where id=actor and deleted_at is null and email_confirmed_at is not null;
  if not found then raise insufficient_privilege using message='Confirmed account required'; end if;
  candidate := nullif(left(btrim(metadata->>'nickname'),40),'');
  -- Nickname collisions must not strand an otherwise valid account.
  loop
    candidate := coalesce(candidate,'회원_' || replace(gen_random_uuid()::text,'-',''));
    begin
      insert into public.profiles(id,nickname,company,is_admin,is_verified)
        values(actor,candidate,nullif(left(btrim(metadata->>'company'),200),''),false,false);
      return;
    exception when unique_violation then
      if exists(select 1 from public.profiles where id=actor) then return; end if;
      candidate := null;
    end;
  end loop;
end;
$$;
revoke all on function public.ensure_my_profile() from public,anon;
grant execute on function public.ensure_my_profile() to authenticated;
commit;

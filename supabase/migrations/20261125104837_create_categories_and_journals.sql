-- Categories table
create table if not exists public.categories (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null default auth.uid() references auth.users(id) on delete cascade,
  title text not null check (char_length(btrim(title)) > 0),
  is_default boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint categories_id_user_id_unique unique (id, user_id),
  constraint categories_default_title_check check (not is_default or title = 'عمومی')
);

create unique index if not exists categories_one_default_per_user_idx
  on public.categories (user_id)
  where (is_default = true);

create index if not exists categories_user_default_created_idx
  on public.categories (user_id, is_default desc, created_at asc);

-- Protect immutable category fields and prevent modifying/deleting the default category
create or replace function private.protect_categories_immutable_fields()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  if tg_op = 'UPDATE' then
    if old.is_default then
      raise exception 'Default category cannot be modified' using errcode = '42501';
    end if;

    if new.user_id is distinct from old.user_id then
      raise exception 'Category owner cannot be changed' using errcode = '42501';
    end if;

    if new.is_default is distinct from old.is_default then
      raise exception 'Category default status cannot be changed' using errcode = '42501';
    end if;

    return new;
  end if;

  if tg_op = 'DELETE' then
    if old.is_default and exists (select 1 from auth.users where id = old.user_id) then
      raise exception 'Default category cannot be deleted' using errcode = '42501';
    end if;

    return old;
  end if;

  return null;
end;
$$;

revoke execute on function private.protect_categories_immutable_fields() from public, anon, authenticated;

drop trigger if exists protect_categories_immutable_fields on public.categories;
create trigger protect_categories_immutable_fields
  before update or delete on public.categories
  for each row
  execute function private.protect_categories_immutable_fields();

drop trigger if exists set_categories_updated_at on public.categories;
create trigger set_categories_updated_at
  before update on public.categories
  for each row
  execute function private.set_updated_at();

alter table public.categories enable row level security;

revoke all on table public.categories from public, anon;
grant select, insert, update, delete on table public.categories to authenticated;

drop policy if exists "Users can view their own categories" on public.categories;
create policy "Users can view their own categories"
  on public.categories
  for select
  to authenticated
  using ((select auth.uid()) = user_id);

drop policy if exists "Users can create their own non-default categories" on public.categories;
create policy "Users can create their own non-default categories"
  on public.categories
  for insert
  to authenticated
  with check (
    (select auth.uid()) = user_id
    and is_default = false
  );

drop policy if exists "Users can update their own non-default categories" on public.categories;
create policy "Users can update their own non-default categories"
  on public.categories
  for update
  to authenticated
  using (
    (select auth.uid()) = user_id
    and is_default = false
  )
  with check (
    (select auth.uid()) = user_id
    and is_default = false
  );

drop policy if exists "Users can delete their own non-default categories" on public.categories;
create policy "Users can delete their own non-default categories"
  on public.categories
  for delete
  to authenticated
  using (
    (select auth.uid()) = user_id
    and is_default = false
  );

-- Ensure every user has exactly one default 'عمومی' category
create or replace function private.ensure_user_default_category(p_user_id uuid)
returns void
language plpgsql
security definer
set search_path = ''
as $$
begin
  if p_user_id is null then
    return;
  end if;

  insert into public.categories (user_id, title, is_default)
  values (p_user_id, 'عمومی', true)
  on conflict (user_id) where (is_default = true) do nothing;
end;
$$;

revoke execute on function private.ensure_user_default_category(uuid) from public, anon, authenticated;

create or replace function private.handle_new_user_default_category()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  perform private.ensure_user_default_category(new.id);
  return new;
end;
$$;

revoke execute on function private.handle_new_user_default_category() from public, anon, authenticated;

drop trigger if exists on_auth_user_created_default_category on auth.users;
create trigger on_auth_user_created_default_category
  after insert on auth.users
  for each row
  execute function private.handle_new_user_default_category();

-- Idempotent backfill for existing users
insert into public.categories (user_id, title, is_default)
select id, 'عمومی', true
from auth.users
on conflict (user_id) where (is_default = true) do nothing;

-- Journals table
create table if not exists public.journals (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null default auth.uid() references auth.users(id) on delete cascade,
  category_id uuid not null,
  title text not null check (char_length(btrim(title)) > 0),
  content text not null default '',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint journals_category_user_fkey
    foreign key (category_id, user_id)
    references public.categories (id, user_id)
    on delete restrict
    deferrable initially deferred
);

create index if not exists journals_user_category_updated_idx
  on public.journals (user_id, category_id, updated_at desc);

create index if not exists journals_category_user_idx
  on public.journals (category_id, user_id);

create or replace function private.protect_journals_immutable_fields()
returns trigger
language plpgsql
security invoker
set search_path = ''
as $$
begin
  if new.user_id is distinct from old.user_id then
    raise exception 'Journal owner cannot be changed' using errcode = '42501';
  end if;

  return new;
end;
$$;

revoke execute on function private.protect_journals_immutable_fields() from public, anon, authenticated;

drop trigger if exists protect_journals_immutable_fields on public.journals;
create trigger protect_journals_immutable_fields
  before update on public.journals
  for each row
  execute function private.protect_journals_immutable_fields();

drop trigger if exists set_journals_updated_at on public.journals;
create trigger set_journals_updated_at
  before update on public.journals
  for each row
  execute function private.set_updated_at();

alter table public.journals enable row level security;

revoke all on table public.journals from public, anon;
grant select, insert, update, delete on table public.journals to authenticated;

drop policy if exists "Users can view their own journals" on public.journals;
create policy "Users can view their own journals"
  on public.journals
  for select
  to authenticated
  using ((select auth.uid()) = user_id);

drop policy if exists "Users can create their own journals" on public.journals;
create policy "Users can create their own journals"
  on public.journals
  for insert
  to authenticated
  with check (
    (select auth.uid()) = user_id
    and exists (
      select 1
      from public.categories c
      where c.id = category_id
        and c.user_id = (select auth.uid())
    )
  );

drop policy if exists "Users can update their own journals" on public.journals;
create policy "Users can update their own journals"
  on public.journals
  for update
  to authenticated
  using ((select auth.uid()) = user_id)
  with check (
    (select auth.uid()) = user_id
    and exists (
      select 1
      from public.categories c
      where c.id = category_id
        and c.user_id = (select auth.uid())
    )
  );

drop policy if exists "Users can delete their own journals" on public.journals;
create policy "Users can delete their own journals"
  on public.journals
  for delete
  to authenticated
  using ((select auth.uid()) = user_id);

-- Atomic category deletion RPC: moves journals to user's default category and deletes regular category
create or replace function public.delete_category(p_category_id uuid)
returns table (
  deleted_category_id uuid,
  default_category_id uuid,
  moved_journals_count integer
)
language plpgsql
security invoker
set search_path = ''
as $$
declare
  v_user_id uuid;
  v_category record;
  v_default_category_id uuid;
  v_moved_count integer := 0;
begin
  v_user_id := (select auth.uid());
  if v_user_id is null then
    raise exception 'Authentication required' using errcode = '42501';
  end if;

  if p_category_id is null then
    raise exception 'Category ID is required' using errcode = '22023';
  end if;

  select c.id, c.user_id, c.is_default
    into v_category
    from public.categories c
    where c.id = p_category_id
      and c.user_id = v_user_id
    for update;

  if not found then
    raise exception 'Category not found' using errcode = 'P0002';
  end if;

  if v_category.is_default then
    raise exception 'Default category cannot be deleted' using errcode = '42501';
  end if;

  select c.id
    into v_default_category_id
    from public.categories c
    where c.user_id = v_user_id
      and c.is_default = true
    for share;

  if v_default_category_id is null then
    raise exception 'Default category not found' using errcode = 'P0002';
  end if;

  update public.journals j
    set category_id = v_default_category_id
    where j.category_id = p_category_id
      and j.user_id = v_user_id;

  get diagnostics v_moved_count = row_count;

  delete from public.categories c
    where c.id = p_category_id
      and c.user_id = v_user_id
      and c.is_default = false;

  if not found then
    raise exception 'Category could not be deleted' using errcode = '42501';
  end if;

  deleted_category_id := p_category_id;
  default_category_id := v_default_category_id;
  moved_journals_count := v_moved_count;
  return next;
end;
$$;

revoke all on function public.delete_category(uuid) from public, anon;
grant execute on function public.delete_category(uuid) to authenticated;

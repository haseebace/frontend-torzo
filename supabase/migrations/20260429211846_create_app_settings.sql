create table if not exists public.app_settings (
  id text primary key default 'global',
  real_debrid_api_key_ciphertext text,
  real_debrid_api_key_iv text,
  real_debrid_api_key_tag text,
  real_debrid_connected boolean not null default false,
  real_debrid_username text,
  providers text[] not null default array['rarbg']::text[],
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint app_settings_singleton check (id = 'global'),
  constraint app_settings_providers_allowed check (
    providers <@ array['rarbg', 'the-pirate-bay', 'yts']::text[]
  )
);

alter table public.app_settings enable row level security;

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists app_settings_set_updated_at on public.app_settings;

create trigger app_settings_set_updated_at
before update on public.app_settings
for each row
execute function public.set_updated_at();

insert into public.app_settings (id, providers)
values ('global', array['rarbg']::text[])
on conflict (id) do nothing;

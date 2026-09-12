-- 0013: Collaboration availability flag.
-- Required by the Collaboration Layer so artists can indicate that
-- they are open to collaboration and appear on /collaborate.

alter table public.profiles
  add column open_to_collaborate boolean not null default false;

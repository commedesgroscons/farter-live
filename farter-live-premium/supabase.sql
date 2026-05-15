create table if not exists posts (
  id bigint generated always as identity primary key,
  username text,
  score integer,
  tier text,
  duration text,
  reactions integer default 0,
  created_at timestamp with time zone default timezone('utc'::text, now())
);
create table if not exists messages (
  id bigint generated always as identity primary key,
  username text,
  content text,
  created_at timestamp with time zone default timezone('utc'::text, now())
);
alter table posts enable row level security;
alter table messages enable row level security;
drop policy if exists "Allow public read" on posts;
drop policy if exists "Allow public insert" on posts;
drop policy if exists "Allow public read messages" on messages;
drop policy if exists "Allow public insert messages" on messages;
create policy "Allow public read" on posts for select using (true);
create policy "Allow public insert" on posts for insert with check (true);
create policy "Allow public read messages" on messages for select using (true);
create policy "Allow public insert messages" on messages for insert with check (true);

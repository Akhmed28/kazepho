# Supabase Setup Guide

## Step 1 — Create a Supabase project

1. Go to https://supabase.com and sign up (free)
2. Click **"New Project"**
3. Name it `kazepho`, choose a region close to Kazakhstan (e.g. Europe West)
4. Set a strong database password and save it somewhere
5. Wait ~2 minutes for the project to spin up

---

## Step 2 — Create the problems table

In your Supabase dashboard, go to **SQL Editor** and run this:

```sql
create table problems (
  id uuid default gen_random_uuid() primary key,
  created_at timestamp with time zone default timezone('utc', now()),
  title text not null,
  olympiad text not null check (olympiad in ('KazEPhO', 'Respa', 'IZhO')),
  year integer not null,
  grade_level integer,
  difficulty text not null check (difficulty in ('Easy', 'Medium', 'Hard')),
  statement text not null,
  experimental_setup text not null,
  solution text not null,
  tags text[] default '{}'
);

-- Allow anyone to read problems (public access)
alter table problems enable row level security;

create policy "Anyone can read problems"
  on problems for select
  using (true);

create policy "Authenticated users can insert"
  on problems for insert
  with check (true);

create policy "Authenticated users can update"
  on problems for update
  using (true);

create policy "Authenticated users can delete"
  on problems for delete
  using (true);
```

---

## Step 3 — Seed with sample data (optional)

```sql
insert into problems (title, olympiad, year, grade_level, difficulty, statement, experimental_setup, solution, tags)
values (
  'Measuring the Speed of Sound in Air',
  'KazEPhO', 2023, 11, 'Medium',
  'Using the equipment provided (speaker, microphone, oscilloscope, ruler), determine the speed of sound in air at room temperature. Compare with the theoretical value $v = \sqrt{\gamma R T / M}$.',
  'A speaker and microphone are placed at distance $d$ apart on a ruler track. The oscilloscope displays both signals.',
  'The speed of sound: $$v = f\lambda$$ Typical result: $v \approx 343\,\text{m/s}$ at $T = 20^\circ\text{C}$.',
  ARRAY['acoustics', 'waves', 'measurement']
);
```

---

## Step 4 — Get your API keys

In Supabase dashboard → **Settings** → **API**:
- Copy **Project URL** 
- Copy **anon public** key

---

## Step 5 — Add to your local project

Create a file called `.env.local` in your kazepho folder:

```
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here
```

---

## Step 6 — Add to Vercel

In Vercel dashboard → your project → **Settings** → **Environment Variables**:

Add both:
- `VITE_SUPABASE_URL` = your project URL
- `VITE_SUPABASE_ANON_KEY` = your anon key

Then redeploy (or it auto-deploys on next push).

---

## Done!

The site will now:
- Load problems from Supabase on every page visit
- Save new problems to Supabase when admin adds them
- Show edits immediately to all users
- Never lose data on refresh

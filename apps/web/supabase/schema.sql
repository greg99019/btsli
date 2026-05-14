-- ============================================================
-- BTSLI Workplace Training Platform – Supabase PostgreSQL Schema
-- Run this in the Supabase SQL Editor (project > SQL Editor > New query)
-- ============================================================

-- ── Extensions ────────────────────────────────────────────────────────────────
create extension if not exists "uuid-ossp";

-- ── Tables ────────────────────────────────────────────────────────────────────

create table public.organizations (
  id              uuid        primary key default gen_random_uuid(),
  name            text        not null,
  slug            text        unique not null,
  industry        text,
  size_range      text,
  logo_url        text,
  primary_color   text        not null default '#1e293b',
  subscription_tier text      not null default 'standard'
    check (subscription_tier in ('trial','standard','professional','enterprise')),
  is_active       boolean     not null default true,
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now()
);

create table public.profiles (
  id              uuid        primary key references auth.users(id) on delete cascade,
  email           text        not null,
  full_name       text,
  avatar_url      text,
  role            text        not null default 'participant'
    check (role in ('super_admin','consultant','org_admin','manager','participant')),
  organization_id uuid        references public.organizations(id) on delete set null,
  job_title       text,
  department      text,
  phone           text,
  is_active       boolean     not null default true,
  onboarding_complete boolean not null default false,
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now()
);

create table public.module_categories (
  id          uuid    primary key default gen_random_uuid(),
  name        text    not null unique,
  color_class text    not null default 'bg-slate-100 text-slate-700',
  dot_class   text    not null default 'bg-slate-500',
  icon        text,
  sort_order  integer not null default 0,
  created_at  timestamptz not null default now()
);

create table public.training_modules (
  id               uuid    primary key default gen_random_uuid(),
  title            text    not null,
  description      text,
  long_description text,
  content          text,
  category_id      uuid    references public.module_categories(id) on delete set null,
  duration_minutes integer not null default 0,
  duration_seconds integer not null default 0,
  thumbnail_url    text,
  video_url        text,
  video_embed_code text,
  is_required      boolean not null default false,
  is_published     boolean not null default true,
  sort_order       integer not null default 0,
  organization_id  uuid    references public.organizations(id) on delete cascade,
  created_by       uuid    references public.profiles(id) on delete set null,
  facilitator_name text    not null default 'BTSLI Consulting Team',
  total_enrollments integer not null default 0,
  created_at       timestamptz not null default now(),
  updated_at       timestamptz not null default now()
);

create table public.module_resources (
  id             uuid    primary key default gen_random_uuid(),
  module_id      uuid    not null references public.training_modules(id) on delete cascade,
  title          text    not null,
  description    text,
  file_url       text    not null,
  file_type      text,
  file_size_bytes bigint,
  sort_order     integer not null default 0,
  created_at     timestamptz not null default now()
);

create table public.quizzes (
  id                  uuid    primary key default gen_random_uuid(),
  module_id           uuid    not null unique references public.training_modules(id) on delete cascade,
  title               text,
  instructions        text,
  passing_score       integer not null default 70,
  max_attempts        integer,
  time_limit_minutes  integer,
  randomize_questions boolean not null default false,
  created_at          timestamptz not null default now()
);

create table public.quiz_questions (
  id            uuid    primary key default gen_random_uuid(),
  quiz_id       uuid    not null references public.quizzes(id) on delete cascade,
  question_text text    not null,
  question_type text    not null default 'multiple_choice'
    check (question_type in ('multiple_choice','true_false','short_answer')),
  points        integer not null default 1,
  explanation   text,
  sort_order    integer not null default 0,
  created_at    timestamptz not null default now()
);

create table public.quiz_answer_options (
  id          uuid    primary key default gen_random_uuid(),
  question_id uuid    not null references public.quiz_questions(id) on delete cascade,
  answer_text text    not null,
  is_correct  boolean not null default false,
  sort_order  integer not null default 0
);

create table public.user_progress (
  id                    uuid    primary key default gen_random_uuid(),
  user_id               uuid    not null references public.profiles(id) on delete cascade,
  module_id             uuid    not null references public.training_modules(id) on delete cascade,
  organization_id       uuid    references public.organizations(id) on delete set null,
  status                text    not null default 'in_progress'
    check (status in ('in_progress', 'completed')),
  progress_percentage   integer not null default 0 check (progress_percentage between 0 and 100),
  percentage_complete   integer not null default 0 check (percentage_complete between 0 and 100),
  time_spent_seconds    integer not null default 0,
  video_position_seconds integer not null default 0,
  started_at            timestamptz not null default now(),
  last_accessed_at      timestamptz not null default now(),
  completed_at          timestamptz,
  quiz_score            integer,
  quiz_passed           boolean,
  quiz_attempts         integer not null default 0,
  unique(user_id, module_id)
);

create table public.certificates (
  id                 uuid    primary key default gen_random_uuid(),
  user_id            uuid    not null references public.profiles(id) on delete cascade,
  module_id          uuid    not null references public.training_modules(id) on delete cascade,
  organization_id    uuid    references public.organizations(id) on delete set null,
  certificate_number text    unique not null,
  issued_at          timestamptz not null default now(),
  unique(user_id, module_id)
);

create table public.training_assignments (
  id                   uuid    primary key default gen_random_uuid(),
  module_id            uuid    not null references public.training_modules(id) on delete cascade,
  assigned_to_user_id  uuid    references public.profiles(id) on delete cascade,
  assigned_to_org_id   uuid    references public.organizations(id) on delete cascade,
  assigned_by          uuid    references public.profiles(id) on delete set null,
  due_date             date,
  is_required          boolean not null default true,
  created_at           timestamptz not null default now(),
  constraint assignment_target check (assigned_to_user_id is not null or assigned_to_org_id is not null)
);

create table public.announcements (
  id                uuid    primary key default gen_random_uuid(),
  title             text    not null,
  body              text    not null default '',
  content           text    not null default '',
  announcement_type text    not null default 'info'
    check (announcement_type in ('info','warning','success','urgent')),
  type              text    not null default 'info'
    check (type in ('info','warning','success','urgent')),
  organization_id   uuid    references public.organizations(id) on delete cascade,
  created_by        uuid    references public.profiles(id) on delete set null,
  published_at      timestamptz not null default now(),
  expires_at        timestamptz,
  is_pinned         boolean not null default false,
  is_visible        boolean not null default true,
  created_at        timestamptz not null default now()
);

create table public.live_sessions (
  id              uuid    primary key default gen_random_uuid(),
  title           text    not null,
  description     text,
  session_type    text    not null default 'live'
    check (session_type in ('live','workshop','check_in','webinar')),
  scheduled_at    timestamptz not null,
  duration_minutes integer not null default 60,
  meeting_url     text,
  facilitator_id  uuid    references public.profiles(id) on delete set null,
  organization_id uuid    references public.organizations(id) on delete cascade,
  max_attendees   integer,
  is_public       boolean not null default false,
  created_at      timestamptz not null default now()
);

create table public.session_rsvps (
  id         uuid    primary key default gen_random_uuid(),
  session_id uuid    not null references public.live_sessions(id) on delete cascade,
  user_id    uuid    not null references public.profiles(id) on delete cascade,
  created_at timestamptz not null default now(),
  unique(session_id, user_id)
);

-- ── Helper functions ──────────────────────────────────────────────────────────

create or replace function public.current_user_role()
returns text language sql stable security definer as $$
  select role from public.profiles where id = auth.uid();
$$;

create or replace function public.current_user_org()
returns uuid language sql stable security definer as $$
  select organization_id from public.profiles where id = auth.uid();
$$;

-- ── Triggers ──────────────────────────────────────────────────────────────────

-- Auto-create profile row when a new auth user signs up
create or replace function public.handle_new_user()
returns trigger language plpgsql security definer as $$
begin
  insert into public.profiles (id, email, full_name, role, organization_id)
  values (
    new.id,
    new.email,
    new.raw_user_meta_data ->> 'full_name',
    coalesce(new.raw_user_meta_data ->> 'role', 'participant'),
    (new.raw_user_meta_data ->> 'organization_id')::uuid
  );
  return new;
end;
$$;

create or replace trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- Auto-set updated_at
create or replace function public.handle_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger update_organizations_updated_at
  before update on public.organizations for each row execute function public.handle_updated_at();
create trigger update_profiles_updated_at
  before update on public.profiles for each row execute function public.handle_updated_at();
create trigger update_training_modules_updated_at
  before update on public.training_modules for each row execute function public.handle_updated_at();

-- Auto-issue certificate when progress reaches 100%
create or replace function public.handle_progress_complete()
returns trigger language plpgsql security definer as $$
declare
  v_cert_num text;
  v_org_id   uuid;
begin
  if new.progress_percentage = 100 and coalesce(old.progress_percentage, 0) < 100 then
    new.completed_at = coalesce(new.completed_at, now());
    v_org_id = coalesce(
      new.organization_id,
      (select organization_id from public.profiles where id = new.user_id)
    );
    v_cert_num = 'BTSLI-'
      || upper(substring(new.user_id::text, 1, 6))
      || '-'
      || upper(substring(new.module_id::text, 1, 6))
      || '-'
      || to_char(now(), 'YYYYMMDD');
    insert into public.certificates (user_id, module_id, organization_id, certificate_number)
    values (new.user_id, new.module_id, v_org_id, v_cert_num)
    on conflict (user_id, module_id) do nothing;
  end if;
  return new;
end;
$$;

create trigger on_progress_complete
  before update of progress_percentage on public.user_progress
  for each row execute function public.handle_progress_complete();

-- ── Indexes ───────────────────────────────────────────────────────────────────

create index idx_profiles_organization_id     on public.profiles(organization_id);
create index idx_profiles_role                on public.profiles(role);
create index idx_modules_category_id          on public.training_modules(category_id);
create index idx_modules_organization_id      on public.training_modules(organization_id);
create index idx_modules_is_published         on public.training_modules(is_published);
create index idx_progress_user_id             on public.user_progress(user_id);
create index idx_progress_module_id           on public.user_progress(module_id);
create index idx_certificates_user_id         on public.certificates(user_id);
create index idx_announcements_org            on public.announcements(organization_id);
create index idx_sessions_scheduled_at        on public.live_sessions(scheduled_at);
create index idx_sessions_organization_id     on public.live_sessions(organization_id);
create index idx_assignments_user_id          on public.training_assignments(assigned_to_user_id);
create index idx_assignments_org_id           on public.training_assignments(assigned_to_org_id);

-- ── Row Level Security ────────────────────────────────────────────────────────

alter table public.organizations        enable row level security;
alter table public.profiles             enable row level security;
alter table public.module_categories    enable row level security;
alter table public.training_modules     enable row level security;
alter table public.module_resources     enable row level security;
alter table public.quizzes              enable row level security;
alter table public.quiz_questions       enable row level security;
alter table public.quiz_answer_options  enable row level security;
alter table public.user_progress        enable row level security;
alter table public.certificates         enable row level security;
alter table public.training_assignments enable row level security;
alter table public.announcements        enable row level security;
alter table public.live_sessions        enable row level security;
alter table public.session_rsvps        enable row level security;

-- Organizations
create policy "view_own_org" on public.organizations for select
  using (id = public.current_user_org() or public.current_user_role() in ('super_admin','consultant'));
create policy "manage_orgs_admin" on public.organizations for all
  using (public.current_user_role() in ('super_admin','consultant'));

-- Profiles
create policy "view_own_profile" on public.profiles for select using (id = auth.uid());
create policy "view_org_profiles" on public.profiles for select
  using (organization_id = public.current_user_org() and public.current_user_role() in ('org_admin','manager','consultant','super_admin'));
create policy "view_all_profiles_sadmin" on public.profiles for select
  using (public.current_user_role() = 'super_admin');
create policy "update_own_profile" on public.profiles for update using (id = auth.uid());
create policy "admin_update_profiles" on public.profiles for update
  using (organization_id = public.current_user_org() and public.current_user_role() in ('org_admin','super_admin'));

-- Module categories (public read for authenticated)
create policy "view_categories" on public.module_categories for select using (auth.uid() is not null);
create policy "manage_categories" on public.module_categories for all
  using (public.current_user_role() in ('super_admin','consultant','org_admin'));

-- Training modules
create policy "view_published_modules" on public.training_modules for select
  using (is_published = true and (organization_id is null or organization_id = public.current_user_org() or public.current_user_role() in ('super_admin','consultant')));
create policy "admin_view_all_modules" on public.training_modules for select
  using (public.current_user_role() in ('super_admin','consultant') or (public.current_user_role() in ('org_admin','manager') and organization_id = public.current_user_org()));
create policy "manage_modules" on public.training_modules for all
  using (public.current_user_role() in ('super_admin','consultant') or (public.current_user_role() = 'org_admin' and organization_id = public.current_user_org()));

-- Module resources / quizzes / questions / options (auth read, admin write)
create policy "view_resources" on public.module_resources for select using (auth.uid() is not null);
create policy "manage_resources" on public.module_resources for all using (public.current_user_role() in ('super_admin','consultant','org_admin'));
create policy "view_quizzes" on public.quizzes for select using (auth.uid() is not null);
create policy "manage_quizzes" on public.quizzes for all using (public.current_user_role() in ('super_admin','consultant','org_admin'));
create policy "view_questions" on public.quiz_questions for select using (auth.uid() is not null);
create policy "manage_questions" on public.quiz_questions for all using (public.current_user_role() in ('super_admin','consultant','org_admin'));
create policy "view_options" on public.quiz_answer_options for select using (auth.uid() is not null);
create policy "manage_options" on public.quiz_answer_options for all using (public.current_user_role() in ('super_admin','consultant','org_admin'));

-- User progress
create policy "view_own_progress" on public.user_progress for select using (user_id = auth.uid());
create policy "insert_own_progress" on public.user_progress for insert with check (user_id = auth.uid());
create policy "update_own_progress" on public.user_progress for update using (user_id = auth.uid());
create policy "admin_view_org_progress" on public.user_progress for select
  using (organization_id = public.current_user_org() and public.current_user_role() in ('org_admin','manager','super_admin','consultant'));

-- Certificates
create policy "view_own_certs" on public.certificates for select using (user_id = auth.uid());
create policy "admin_view_org_certs" on public.certificates for select
  using (organization_id = public.current_user_org() and public.current_user_role() in ('org_admin','manager','super_admin'));

-- Assignments
create policy "view_assignments" on public.training_assignments for select
  using (assigned_to_user_id = auth.uid() or assigned_to_org_id = public.current_user_org() or public.current_user_role() in ('super_admin','consultant'));
create policy "manage_assignments" on public.training_assignments for all
  using (public.current_user_role() in ('super_admin','consultant','org_admin','manager'));

-- Announcements
create policy "view_announcements" on public.announcements for select
  using (organization_id is null or organization_id = public.current_user_org() or public.current_user_role() in ('super_admin','consultant'));
create policy "manage_announcements" on public.announcements for all
  using (public.current_user_role() in ('super_admin','consultant') or (public.current_user_role() = 'org_admin' and organization_id = public.current_user_org()));

-- Live sessions
create policy "view_sessions" on public.live_sessions for select
  using (is_public = true or organization_id = public.current_user_org() or public.current_user_role() in ('super_admin','consultant'));
create policy "manage_sessions" on public.live_sessions for all
  using (public.current_user_role() in ('super_admin','consultant','org_admin'));

-- Session RSVPs
create policy "manage_own_rsvps" on public.session_rsvps for all using (user_id = auth.uid());
create policy "admin_view_rsvps" on public.session_rsvps for select
  using (public.current_user_role() in ('super_admin','consultant','org_admin','manager'));

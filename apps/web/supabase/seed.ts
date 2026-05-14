/**
 * BTSLI Platform – Supabase Seed Script
 * Generates: 3 orgs, 20 users, 10 modules, progress, announcements, sessions
 *
 * Run:  npx ts-node --esm supabase/seed.ts
 *   or: npx tsx supabase/seed.ts
 *
 * Requires in .env:
 *   NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
 *   SUPABASE_SERVICE_ROLE_KEY=eyJ...
 */

import { createClient } from '@supabase/supabase-js'
import * as dotenv from 'dotenv'
import * as path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
dotenv.config({ path: path.join(__dirname, '../.env') })

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  { auth: { autoRefreshToken: false, persistSession: false } }
)

// ── Seed data ─────────────────────────────────────────────────────────────────

const ORGS = [
  { name: 'Meridian Healthcare Group', slug: 'meridian-health', industry: 'Healthcare', size_range: '51-200' },
  { name: 'Apex Logistics Corp', slug: 'apex-logistics', industry: 'Logistics & Supply Chain', size_range: '201-500' },
  { name: 'Cornerstone Education Services', slug: 'cornerstone-edu', industry: 'Education', size_range: '11-50' },
]

const CATEGORIES = [
  { name: 'Getting Started',                 color_class: 'bg-blue-100 text-blue-700',   dot_class: 'bg-blue-500',   sort_order: 1 },
  { name: 'Workplace Systems',               color_class: 'bg-indigo-100 text-indigo-700', dot_class: 'bg-indigo-500', sort_order: 2 },
  { name: 'Communication',                   color_class: 'bg-purple-100 text-purple-700', dot_class: 'bg-purple-500', sort_order: 3 },
  { name: 'Leadership & Supervision',        color_class: 'bg-amber-100 text-amber-700', dot_class: 'bg-amber-500',  sort_order: 4 },
  { name: 'Standard Operating Procedures',   color_class: 'bg-teal-100 text-teal-700',   dot_class: 'bg-teal-500',   sort_order: 5 },
  { name: 'Accountability & Follow-Through', color_class: 'bg-orange-100 text-orange-700', dot_class: 'bg-orange-500', sort_order: 6 },
  { name: 'Client/Customer Service',         color_class: 'bg-green-100 text-green-700',  dot_class: 'bg-green-500',  sort_order: 7 },
  { name: 'Compliance & Safety',             color_class: 'bg-red-100 text-red-700',     dot_class: 'bg-red-500',    sort_order: 8 },
  { name: 'Team Collaboration',              color_class: 'bg-cyan-100 text-cyan-700',   dot_class: 'bg-cyan-500',   sort_order: 9 },
  { name: 'Performance Improvement',         color_class: 'bg-rose-100 text-rose-700',   dot_class: 'bg-rose-500',   sort_order: 10 },
]

const MODULE_DATA = [
  { title: 'Workplace Orientation & Platform Overview', category: 'Getting Started', duration: 720, required: true, description: 'Get oriented to the learning portal, understand your assigned modules, and set expectations for the training cycle.' },
  { title: 'Effective Workplace Communication', category: 'Communication', duration: 920, required: true, description: 'Build stronger communication habits that improve clarity, accountability, and team performance across departments.' },
  { title: 'Standard Operating Procedures: Building & Using SOPs', category: 'Standard Operating Procedures', duration: 1125, required: true, description: 'Learn how to create, maintain, and follow SOPs that reduce inconsistency and reliance on institutional memory.' },
  { title: 'Accountability Structures That Work', category: 'Accountability & Follow-Through', duration: 850, required: true, description: 'Establish individual and team accountability habits that drive follow-through and measurable results.' },
  { title: 'Leadership Fundamentals for Supervisors', category: 'Leadership & Supervision', duration: 1350, required: false, description: 'Core competencies for supervisors and department leads: delegation, feedback, team development, and performance coaching.' },
  { title: 'Team Collaboration & Cross-Department Coordination', category: 'Team Collaboration', duration: 710, required: false, description: 'Practical tools for improving handoffs, shared priorities, and collaborative problem-solving across teams.' },
  { title: 'Workplace Systems: Diagnosing & Strengthening Operations', category: 'Workplace Systems', duration: 1140, required: false, description: 'Identify operational gaps, apply a systems-thinking lens to persistent problems, and build more reliable workflows.' },
  { title: 'Client & Customer Service Excellence', category: 'Client/Customer Service', duration: 810, required: false, description: "Deliver consistent, professional service experiences that reflect your organization's values and standards." },
  { title: 'Compliance & Workplace Safety Essentials', category: 'Compliance & Safety', duration: 975, required: false, description: "Understand your organization's compliance obligations, safety protocols, and reporting responsibilities." },
  { title: 'Performance Improvement Planning', category: 'Performance Improvement', duration: 1060, required: false, description: 'Navigate performance gaps constructively — create actionable plans that support growth and system alignment.' },
]

const USERS: Array<{ email: string; full_name: string; role: string; org_index: number; job_title: string }> = [
  // Org 0 – Meridian Healthcare
  { email: 'aknight@meridianhealth.com',  full_name: 'Alexis Knight',     role: 'org_admin',   org_index: 0, job_title: 'Director of Operations' },
  { email: 'jmurray@meridianhealth.com',  full_name: 'James Murray',      role: 'manager',     org_index: 0, job_title: 'Department Manager' },
  { email: 'sbrown@meridianhealth.com',   full_name: 'Sandra Brown',      role: 'participant', org_index: 0, job_title: 'Clinical Coordinator' },
  { email: 'dlee@meridianhealth.com',     full_name: 'Derek Lee',         role: 'participant', org_index: 0, job_title: 'Administrative Specialist' },
  { email: 'pchen@meridianhealth.com',    full_name: 'Patricia Chen',     role: 'participant', org_index: 0, job_title: 'Patient Services Rep' },
  { email: 'rnguyen@meridianhealth.com',  full_name: 'Ryan Nguyen',       role: 'participant', org_index: 0, job_title: 'Compliance Officer' },
  // Org 1 – Apex Logistics
  { email: 'mwilliams@apexlogistics.com', full_name: 'Marcus Williams',   role: 'org_admin',   org_index: 1, job_title: 'VP of Operations' },
  { email: 'tgarcia@apexlogistics.com',   full_name: 'Teresa Garcia',     role: 'manager',     org_index: 1, job_title: 'Warehouse Manager' },
  { email: 'hkim@apexlogistics.com',      full_name: 'Hannah Kim',        role: 'participant', org_index: 1, job_title: 'Logistics Coordinator' },
  { email: 'cjohnson@apexlogistics.com',  full_name: 'Calvin Johnson',    role: 'participant', org_index: 1, job_title: 'Fleet Supervisor' },
  { email: 'lmartin@apexlogistics.com',   full_name: 'Lisa Martin',       role: 'participant', org_index: 1, job_title: 'Dispatch Agent' },
  { email: 'bthomas@apexlogistics.com',   full_name: 'Brian Thomas',      role: 'participant', org_index: 1, job_title: 'Driver Relations' },
  { email: 'awilson@apexlogistics.com',   full_name: 'Angela Wilson',     role: 'participant', org_index: 1, job_title: 'Safety Coordinator' },
  // Org 2 – Cornerstone
  { email: 'ejones@cornerstoneedu.com',   full_name: 'Evelyn Jones',      role: 'org_admin',   org_index: 2, job_title: 'Executive Director' },
  { email: 'rsmith@cornerstoneedu.com',   full_name: 'Robert Smith',      role: 'manager',     org_index: 2, job_title: 'Program Director' },
  { email: 'ntaylor@cornerstoneedu.com',  full_name: 'Nicole Taylor',     role: 'participant', org_index: 2, job_title: 'Curriculum Specialist' },
  { email: 'kcook@cornerstoneedu.com',    full_name: 'Kenneth Cook',      role: 'participant', org_index: 2, job_title: 'Training Coordinator' },
  { email: 'mrobinson@cornerstoneedu.com',full_name: 'Michelle Robinson', role: 'participant', org_index: 2, job_title: 'Student Services' },
  // Platform admins
  { email: 'admin@btsli.com',             full_name: 'BTSLI Admin',       role: 'super_admin', org_index: -1, job_title: 'Platform Administrator' },
  { email: 'consultant@btsli.com',        full_name: 'BTSLI Consultant',  role: 'consultant',  org_index: -1, job_title: 'Senior Consultant' },
]

async function seed() {
  console.log('🌱 Starting seed...\n')

  // 1. Insert organizations
  console.log('Creating organizations...')
  const { data: orgs, error: orgErr } = await supabase
    .from('organizations')
    .insert(ORGS)
    .select()
  if (orgErr) throw new Error(`Orgs: ${orgErr.message}`)
  console.log(`  ✓ ${orgs!.length} organizations created`)

  // 2. Insert categories
  console.log('Creating module categories...')
  const { data: cats, error: catErr } = await supabase
    .from('module_categories')
    .insert(CATEGORIES)
    .select()
  if (catErr) throw new Error(`Categories: ${catErr.message}`)
  const catMap = Object.fromEntries(cats!.map(c => [c.name, c.id]))
  console.log(`  ✓ ${cats!.length} categories created`)

  // 3. Create auth users + profiles
  console.log('Creating users...')
  const userIdMap: Record<string, string> = {}
  for (const u of USERS) {
    const org_id = u.org_index >= 0 ? orgs![u.org_index].id : null
    const { data, error } = await supabase.auth.admin.createUser({
      email: u.email,
      password: 'BTSLIDemo2026!',
      email_confirm: true,
      user_metadata: { full_name: u.full_name, role: u.role, organization_id: org_id },
    })
    if (error) { console.warn(`  ⚠ ${u.email}: ${error.message}`); continue }
    userIdMap[u.email] = data.user.id
    // Update job_title in profile
    await supabase.from('profiles').update({ job_title: u.job_title }).eq('id', data.user.id)
    process.stdout.write('.')
  }
  console.log(`\n  ✓ ${Object.keys(userIdMap).length} users created`)

  // 4. Insert training modules (platform-wide, organization_id = null)
  console.log('Creating training modules...')
  const adminId = userIdMap['admin@btsli.com']
  const moduleInserts = MODULE_DATA.map((m, i) => ({
    title: m.title,
    description: m.description,
    category_id: catMap[m.category],
    duration_seconds: m.duration,
    is_required: m.required,
    sort_order: i,
    created_by: adminId,
    total_enrollments: Math.floor(Math.random() * 800) + 200,
    video_url: 'https://www.youtube.com/embed/dQw4w9WgXcQ', // placeholder
  }))
  const { data: modules, error: modErr } = await supabase
    .from('training_modules')
    .insert(moduleInserts)
    .select()
  if (modErr) throw new Error(`Modules: ${modErr.message}`)
  console.log(`  ✓ ${modules!.length} modules created`)

  // 5. Add a quiz to the first module
  console.log('Creating sample quiz...')
  const { data: quiz } = await supabase.from('quizzes').insert({
    module_id: modules![0].id,
    title: 'Orientation Knowledge Check',
    passing_score: 70,
  }).select().single()

  if (quiz) {
    const q1 = await supabase.from('quiz_questions').insert({
      quiz_id: quiz.id, question_text: 'What is the primary purpose of this training platform?', sort_order: 1,
    }).select().single()
    if (q1.data) {
      await supabase.from('quiz_answer_options').insert([
        { question_id: q1.data.id, answer_text: 'Track attendance only', is_correct: false, sort_order: 1 },
        { question_id: q1.data.id, answer_text: 'Build workplace skills and document competency', is_correct: true, sort_order: 2 },
        { question_id: q1.data.id, answer_text: 'Replace in-person meetings', is_correct: false, sort_order: 3 },
        { question_id: q1.data.id, answer_text: 'Monitor employee email', is_correct: false, sort_order: 4 },
      ])
    }
    console.log('  ✓ Sample quiz created')
  }

  // 6. Seed progress for participants
  console.log('Creating sample progress...')
  const participants = USERS.filter(u => u.role === 'participant')
  const progressInserts: object[] = []
  for (const p of participants) {
    const uid = userIdMap[p.email]
    if (!uid) continue
    const orgId = p.org_index >= 0 ? orgs![p.org_index].id : null
    modules!.forEach((m, i) => {
      const pct = i === 0 ? 100 : i === 1 ? Math.floor(Math.random() * 80) + 20 : i === 2 ? Math.floor(Math.random() * 40) : 0
      if (pct > 0) {
        progressInserts.push({
          user_id: uid, module_id: m.id, organization_id: orgId,
          percentage_complete: pct, time_spent_seconds: pct * 10,
          completed_at: pct === 100 ? new Date().toISOString() : null,
        })
      }
    })
  }
  if (progressInserts.length > 0) {
    const { error: progErr } = await supabase.from('user_progress').insert(progressInserts)
    if (progErr) console.warn(`  ⚠ Progress: ${progErr.message}`)
    else console.log(`  ✓ ${progressInserts.length} progress records created`)
  }

  // 7. Seed announcements
  console.log('Creating announcements...')
  const announcementInserts = orgs!.flatMap(org => [
    { title: 'Welcome to the Spring 2026 Training Cycle!', body: `Your organization's training portal is now active. Complete your required modules before the cycle ends.`, announcement_type: 'info', organization_id: org.id, is_pinned: true, created_by: adminId },
    { title: 'Required Modules Deadline: May 31, 2026', body: 'All required training modules must be completed by end of month. Contact your administrator if you need assistance.', announcement_type: 'warning', organization_id: org.id, is_pinned: false, created_by: adminId },
  ])
  const { error: annErr } = await supabase.from('announcements').insert(announcementInserts)
  if (annErr) console.warn(`  ⚠ Announcements: ${annErr.message}`)
  else console.log(`  ✓ ${announcementInserts.length} announcements created`)

  // 8. Seed live sessions
  console.log('Creating live sessions...')
  const now = new Date()
  const sessionInserts = orgs!.flatMap(org => [
    { title: 'Leadership & Accountability Check-In', session_type: 'check_in', scheduled_at: new Date(now.getFullYear(), now.getMonth(), 20, 10, 0).toISOString(), duration_minutes: 60, organization_id: org.id, is_public: false },
    { title: 'SOP Workshop: Documenting Core Processes', session_type: 'workshop', scheduled_at: new Date(now.getFullYear(), now.getMonth(), 27, 14, 0).toISOString(), duration_minutes: 90, organization_id: org.id, is_public: false },
    { title: 'Quarterly Systems Review', session_type: 'live', scheduled_at: new Date(now.getFullYear(), now.getMonth() + 1, 3, 11, 0).toISOString(), duration_minutes: 60, organization_id: org.id, is_public: false },
  ])
  const { error: sesErr } = await supabase.from('live_sessions').insert(sessionInserts)
  if (sesErr) console.warn(`  ⚠ Sessions: ${sesErr.message}`)
  else console.log(`  ✓ ${sessionInserts.length} live sessions created`)

  // 9. Assign all modules to each org
  console.log('Creating training assignments...')
  const assignmentInserts = orgs!.flatMap(org =>
    modules!.map(m => ({
      module_id: m.id, assigned_to_org_id: org.id,
      assigned_by: adminId, is_required: m.is_required,
    }))
  )
  const { error: asgErr } = await supabase.from('training_assignments').insert(assignmentInserts)
  if (asgErr) console.warn(`  ⚠ Assignments: ${asgErr.message}`)
  else console.log(`  ✓ ${assignmentInserts.length} assignments created`)

  console.log('\n✅ Seed complete!')
  console.log('\nDemo credentials (all users):')
  console.log('  Password: BTSLIDemo2026!')
  console.log('\nKey accounts:')
  console.log('  admin@btsli.com        → super_admin')
  console.log('  aknight@meridianhealth.com → org_admin')
  console.log('  sbrown@meridianhealth.com  → participant')
}

seed().catch(err => { console.error('Seed failed:', err); process.exit(1) })

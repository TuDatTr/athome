import { Hono } from 'hono'
import { serveStatic } from 'hono/bun'
import { getCookie, setCookie, deleteCookie } from 'hono/cookie'
import { BaseLayout } from './layouts/BaseLayout'
import { getProfile, getExperiences, getSkills, getEducation, getProjects, getPublications } from './db/queries'
import { 
  upsertProfile, upsertProfileTranslation, 
  createExperience, updateExperienceTranslation, deleteExperience, 
  createSkill, updateSkillTranslation, deleteSkill,
  createEducation, updateEducationTranslation, deleteEducation,
  createProject, updateProjectTranslation, deleteProject,
  createPublication, updatePublicationTranslation, deletePublication
} from './db/mutations'
import { keycloak } from './lib/auth'
import { generateState, generateCodeVerifier } from 'arctic'
import { AdminProfileForm } from './components/AdminProfileForm'

const app = new Hono()

// Static files
app.use('/static/*', serveStatic({ root: './public' }))

// Middleware to determine language
app.use('*', async (c, next) => {
  const lang = getCookie(c, 'lang') || 'en'
  c.set('lang', lang)
  await next()
})

// Public Routes
app.get('/', async (c) => {
  const lang = c.get('lang') as string
  const [profile, experiences, skills, education, projects, publications] = await Promise.all([
    getProfile(lang),
    getExperiences(lang),
    getSkills(lang),
    getEducation(lang),
    getProjects(lang),
    getPublications(lang)
  ]);

  return c.html(
    <BaseLayout title="Home" lang={lang}>
      <div class="max-w-4xl mx-auto mt-10 space-y-20">
        {profile ? (
          <section class="flex flex-col md:flex-row items-center gap-8">
            <div class="flex-1 text-center md:text-left">
              <h2 class="text-5xl font-extrabold mb-2">{profile.name}</h2>
              <h3 class="text-2xl text-blue-600 dark:text-blue-400 font-semibold mb-4">{profile.title}</h3>
              <p class="text-lg text-gray-600 dark:text-gray-400 mb-6 leading-relaxed">
                {profile.about_me}
              </p>
              <div class="flex flex-wrap justify-center md:justify-start gap-4 text-sm text-gray-500">
                <span>📍 {profile.location}</span>
                <span>📧 {profile.email}</span>
                <span>📱 {profile.phone}</span>
              </div>
            </div>
          </section>
        ) : (
          <div class="text-center py-10">
            <h2 class="text-2xl font-bold text-red-500">Profile not found.</h2>
            <p>Please ensure the database is seeded.</p>
          </div>
        )}

        {experiences.length > 0 && (
          <section>
            <h3 class="text-3xl font-bold mb-8 border-b pb-2 dark:border-gray-800">
              {lang === 'en' ? 'Experience' : 'Erfahrung'}
            </h3>
            <div class="space-y-12">
              {experiences.map((exp) => (
                <div class="relative pl-8 border-l-2 border-gray-100 dark:border-gray-800">
                  <div class="absolute -left-[9px] top-0 w-4 h-4 rounded-full bg-blue-600"></div>
                  <div class="flex flex-col md:flex-row md:justify-between md:items-start mb-2">
                    <div>
                      <h4 class="text-xl font-bold">{exp.job_title}</h4>
                      <p class="text-blue-600 dark:text-blue-400 font-medium">{exp.company_name}</p>
                    </div>
                    <div class="text-sm text-gray-500 font-medium">
                      {exp.start_date.split('-')[0]} — {exp.end_date ? exp.end_date.split('-')[0] : (lang === 'en' ? 'Present' : 'Heute')}
                    </div>
                  </div>
                  <p class="text-gray-600 dark:text-gray-400 leading-relaxed">{exp.description}</p>
                </div>
              ))}
            </div>
          </section>
        )}

        {education.length > 0 && (
          <section>
            <h3 class="text-3xl font-bold mb-8 border-b pb-2 dark:border-gray-800">
              {lang === 'en' ? 'Education' : 'Bildung'}
            </h3>
            <div class="space-y-12">
              {education.map((edu) => (
                <div class="relative pl-8 border-l-2 border-gray-100 dark:border-gray-800">
                  <div class="absolute -left-[9px] top-0 w-4 h-4 rounded-full bg-green-600"></div>
                  <div class="flex flex-col md:flex-row md:justify-between md:items-start mb-2">
                    <div>
                      <h4 class="text-xl font-bold">{edu.degree}</h4>
                      <p class="text-green-600 dark:text-green-400 font-medium">{edu.institution}</p>
                    </div>
                    <div class="text-sm text-gray-500 font-medium">
                      {edu.start_date.split('-')[0]} — {edu.end_date ? edu.end_date.split('-')[0] : (lang === 'en' ? 'Present' : 'Heute')}
                    </div>
                  </div>
                  <p class="text-gray-600 dark:text-gray-400 leading-relaxed">{edu.description}</p>
                </div>
              ))}
            </div>
          </section>
        )}

        {publications.length > 0 && (
          <section>
            <h3 class="text-3xl font-bold mb-8 border-b pb-2 dark:border-gray-800">
              {lang === 'en' ? 'Publications' : 'Publikationen'}
            </h3>
            <div class="space-y-10">
              {publications.map((pub) => (
                <div>
                  <h4 class="text-xl font-bold mb-1">{pub.title}</h4>
                  <div class="flex flex-wrap gap-x-4 gap-y-1 text-sm mb-2">
                    <span class="text-blue-600 dark:text-blue-400 font-semibold">{pub.venue} ({pub.year})</span>
                    <span class="text-gray-500">{pub.authors}</span>
                  </div>
                  <p class="text-gray-600 dark:text-gray-400 leading-relaxed">{pub.description}</p>
                </div>
              ))}
            </div>
          </section>
        )}

        {skills.length > 0 && (
          <section>
            <h3 class="text-3xl font-bold mb-8 border-b pb-2 dark:border-gray-800">
              {lang === 'en' ? 'Skills' : 'Fähigkeiten'}
            </h3>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
              {Array.from(new Set(skills.map(s => s.category))).map(category => (
                <div key={category}>
                  <h4 class="text-lg font-semibold mb-4 text-gray-500 uppercase tracking-wider">{category}</h4>
                  <div class="flex flex-wrap gap-2">
                    {skills.filter(s => s.category === category).map(skill => (
                      <span class="px-3 py-1 bg-gray-100 dark:bg-gray-800 rounded-full text-sm font-medium">
                        {skill.name}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {projects.length > 0 && (
          <section>
            <h3 class="text-3xl font-bold mb-8 border-b pb-2 dark:border-gray-800">
              {lang === 'en' ? 'Projects' : 'Projekte'}
            </h3>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
              {projects.map((project) => (
                <div class="border dark:border-gray-800 rounded-xl overflow-hidden group">
                  {project.image_url && <img src={project.image_url} alt={project.title} class="w-full h-48 object-cover group-hover:scale-105 transition" />}
                  <div class="p-6">
                    <h4 class="text-xl font-bold mb-2">{project.title}</h4>
                    <p class="text-gray-600 dark:text-gray-400 mb-4">{project.description}</p>
                    <div class="flex gap-4">
                      {project.github_url && <a href={project.github_url} target="_blank" class="text-blue-600 hover:underline">GitHub</a>}
                      {project.live_url && <a href={project.live_url} target="_blank" class="text-green-600 hover:underline">Live Demo</a>}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}
      </div>
    </BaseLayout>
  )
})

// Language Switcher Route
app.post('/set-lang/:lang', (c) => {
  const lang = c.req.param('lang')
  setCookie(c, 'lang', lang, { path: '/', maxAge: 60 * 60 * 24 * 365 })
  const referer = c.req.header('referer') || '/'
  return c.redirect(referer)
})

// Auth Routes
app.get('/login', async (c) => {
  const state = generateState(); const codeVerifier = generateCodeVerifier()
  const url = keycloak.createAuthorizationURL(state, codeVerifier, ["openid", "profile", "email"])
  setCookie(c, "keycloak_state", state, { path: "/", secure: process.env.NODE_ENV === "production", httpOnly: true, maxAge: 60 * 10, sameSite: "Lax" })
  setCookie(c, "keycloak_code_verifier", codeVerifier, { path: "/", secure: process.env.NODE_ENV === "production", httpOnly: true, maxAge: 60 * 10, sameSite: "Lax" })
  return c.redirect(url.toString())
})

app.get('/admin/callback', async (c) => {
  const code = c.req.query("code"); const state = c.req.query("state"); const storedState = getCookie(c, "keycloak_state"); const codeVerifier = getCookie(c, "keycloak_code_verifier")
  if (!code || !state || !storedState || !codeVerifier || state !== storedState) return c.text("Invalid request", 400)
  try {
    const tokens = await keycloak.validateAuthorizationCode(code, codeVerifier)
    setCookie(c, "auth_token", tokens.accessToken(), { path: "/", secure: process.env.NODE_ENV === "production", httpOnly: true, maxAge: 60 * 60 * 24, sameSite: "Lax" })
    deleteCookie(c, "keycloak_state"); deleteCookie(c, "keycloak_code_verifier")
    return c.redirect("/admin")
  } catch (e) { console.error(e); return c.text("Authentication failed", 500) }
})

app.get('/logout', (c) => { deleteCookie(c, "auth_token"); return c.redirect("/") })

// Admin Routes (Protected)
app.use('/admin/*', async (c, next) => {
  if (c.req.path === '/admin/callback') return await next()
  const token = getCookie(c, "auth_token")
  if (!token) return c.redirect("/login")
  await next()
})

app.get('/admin', (c) => {
  const lang = c.get('lang') as string
  return c.html(
    <BaseLayout title="Admin Dashboard" lang={lang}>
      <div class="max-w-4xl mx-auto mt-10">
        <div class="flex justify-between items-center mb-8"><h2 class="text-3xl font-bold">Admin Dashboard</h2><a href="/logout" class="text-red-600 hover:underline">Logout</a></div>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <a href="/admin/profile" class="p-6 border rounded-xl dark:border-gray-800 hover:border-blue-500 transition"><h3 class="text-xl font-bold mb-2">Edit Profile</h3><p class="text-gray-600 dark:text-gray-400">Update your name, title, about me, and contact info.</p></a>
          <a href="/admin/experience" class="p-6 border rounded-xl dark:border-gray-800 hover:border-blue-500 transition"><h3 class="text-xl font-bold mb-2">Manage Experience</h3><p class="text-gray-600 dark:text-gray-400">Add, edit or remove work history entries.</p></a>
          <a href="/admin/education" class="p-6 border rounded-xl dark:border-gray-800 hover:border-blue-500 transition"><h3 class="text-xl font-bold mb-2">Manage Education</h3><p class="text-gray-600 dark:text-gray-400">Add or remove education entries.</p></a>
          <a href="/admin/skills" class="p-6 border rounded-xl dark:border-gray-800 hover:border-blue-500 transition"><h3 class="text-xl font-bold mb-2">Manage Skills</h3><p class="text-gray-600 dark:text-gray-400">Add or remove technical skills.</p></a>
          <a href="/admin/publications" class="p-6 border rounded-xl dark:border-gray-800 hover:border-blue-500 transition"><h3 class="text-xl font-bold mb-2">Manage Publications</h3><p class="text-gray-600 dark:text-gray-400">Add or remove research publications.</p></a>
          <a href="/admin/projects" class="p-6 border rounded-xl dark:border-gray-800 hover:border-blue-500 transition"><h3 class="text-xl font-bold mb-2">Manage Projects</h3><p class="text-gray-600 dark:text-gray-400">Add or remove portfolio projects.</p></a>
        </div>
      </div>
    </BaseLayout>
  )
})

// Admin - Profile
app.get('/admin/profile', async (c) => {
  const lang = c.get('lang') as string; const profile = await getProfile(lang); if (!profile) return c.redirect('/admin')
  return c.html(<BaseLayout title="Edit Profile" lang={lang}><div class="max-w-4xl mx-auto mt-10"><div class="flex items-center gap-4 mb-8"><a href="/admin" class="text-blue-600 hover:underline">← Back</a><h2 class="text-3xl font-bold">Edit Profile</h2></div><div class="flex gap-4 mb-6"><a href="/admin/profile?lang=en" class={`px-4 py-2 rounded ${lang === 'en' ? 'bg-blue-600 text-white' : 'bg-gray-100 dark:bg-gray-800'}`}>English</a><a href="/admin/profile?lang=de" class={`px-4 py-2 rounded ${lang === 'de' ? 'bg-blue-600 text-white' : 'bg-gray-100 dark:bg-gray-800'}`}>German</a></div><AdminProfileForm profile={profile} lang={lang} /></div></BaseLayout>)
})

app.post('/admin/profile', async (c) => {
  const lang = c.req.query('lang') || 'en'; const body = await c.req.parseBody()
  const profileId = await upsertProfile({ email: body.email as string, phone: body.phone as string, github_url: body.github_url as string, linkedin_url: '' })
  await upsertProfileTranslation({ profile_id: profileId, language_code: lang as string, name: body.name as string, title: body.title as string, about_me: body.about_me as string, location: body.location as string })
  return c.html(<span class="text-green-600">Successfully updated!</span>)
})

// Admin - Experience
app.get('/admin/experience', async (c) => {
  const lang = c.get('lang') as string; const experiences = await getExperiences(lang)
  return c.html(<BaseLayout title="Manage Experience" lang={lang}><div class="max-w-4xl mx-auto mt-10"><div class="flex justify-between items-center mb-8"><div class="flex items-center gap-4"><a href="/admin" class="text-blue-600 hover:underline">← Back</a><h2 class="text-3xl font-bold">Manage Experience</h2></div><a href="/admin/experience/add" class="bg-blue-600 text-white px-4 py-2 rounded font-bold">Add New</a></div><div class="space-y-4">{experiences.map(exp => (<div class="p-4 border rounded dark:border-gray-800 flex justify-between items-center"><div><h4 class="font-bold">{exp.job_title} @ {exp.company_name}</h4><p class="text-sm text-gray-500">{exp.start_date.split('-')[0]} - {exp.end_date ? exp.end_date.split('-')[0] : 'Present'}</p></div><button hx-delete={`/admin/experience/${exp.id}`} hx-confirm="Are you sure?" hx-target="closest div" hx-swap="outerHTML" class="text-red-600 hover:underline">Delete</button></div>))}</div></div></BaseLayout>)
})

app.get('/admin/experience/add', (c) => {
  const lang = c.get('lang') as string
  return c.html(<BaseLayout title="Add Experience" lang={lang}><div class="max-w-2xl mx-auto mt-10"><h2 class="text-3xl font-bold mb-8">Add New Experience</h2><form action="/admin/experience" method="POST" class="space-y-4"><div class="grid grid-cols-2 gap-4"><div><label class="block text-sm font-medium mb-1">Company Name</label><input type="text" name="company_name" required class="w-full p-2 border rounded dark:bg-gray-900 dark:border-gray-700" /></div><div><label class="block text-sm font-medium mb-1">Job Title</label><input type="text" name="job_title" required class="w-full p-2 border rounded dark:bg-gray-900 dark:border-gray-700" /></div></div><div class="grid grid-cols-2 gap-4"><div><label class="block text-sm font-medium mb-1">Start Date</label><input type="date" name="start_date" required class="w-full p-2 border rounded dark:bg-gray-900 dark:border-gray-700" /></div><div><label class="block text-sm font-medium mb-1">End Date</label><input type="date" name="end_date" class="w-full p-2 border rounded dark:bg-gray-900 dark:border-gray-700" /></div></div><div><label class="block text-sm font-medium mb-1">Description (English)</label><textarea name="description_en" required rows={3} class="w-full p-2 border rounded dark:bg-gray-900 dark:border-gray-700"></textarea></div><div><label class="block text-sm font-medium mb-1">Description (German)</label><textarea name="description_de" required rows={3} class="w-full p-2 border rounded dark:bg-gray-900 dark:border-gray-700"></textarea></div><button type="submit" class="w-full bg-blue-600 text-white py-2 rounded font-bold">Save Experience</button></form></div></BaseLayout>)
})

app.post('/admin/experience', async (c) => {
  const body = await c.req.parseBody(); const expId = await createExperience({ start_date: body.start_date as string, end_date: body.end_date as string || null, company_url: '' })
  await updateExperienceTranslation({ experience_id: expId, language_code: 'en', job_title: body.job_title as string, company_name: body.company_name as string, description: body.description_en as string })
  await updateExperienceTranslation({ experience_id: expId, language_code: 'de', job_title: body.job_title as string, company_name: body.company_name as string, description: body.description_de as string })
  return c.redirect('/admin/experience')
})

app.delete('/admin/experience/:id', async (c) => { await deleteExperience(parseInt(c.req.param('id'))); return c.text('') })

// Admin - Education
app.get('/admin/education', async (c) => {
  const lang = c.get('lang') as string; const education = await getEducation(lang)
  return c.html(<BaseLayout title="Manage Education" lang={lang}><div class="max-w-4xl mx-auto mt-10"><div class="flex justify-between items-center mb-8"><div class="flex items-center gap-4"><a href="/admin" class="text-blue-600 hover:underline">← Back</a><h2 class="text-3xl font-bold">Manage Education</h2></div><a href="/admin/education/add" class="bg-blue-600 text-white px-4 py-2 rounded font-bold">Add New</a></div><div class="space-y-4">{education.map(edu => (<div class="p-4 border rounded dark:border-gray-800 flex justify-between items-center"><div><h4 class="font-bold">{edu.degree} @ {edu.institution}</h4><p class="text-sm text-gray-500">{edu.start_date.split('-')[0]} - {edu.end_date ? edu.end_date.split('-')[0] : 'Present'}</p></div><button hx-delete={`/admin/education/${edu.id}`} hx-confirm="Are you sure?" hx-target="closest div" hx-swap="outerHTML" class="text-red-600 hover:underline">Delete</button></div>))}</div></div></BaseLayout>)
})

app.get('/admin/education/add', (c) => {
  const lang = c.get('lang') as string
  return c.html(<BaseLayout title="Add Education" lang={lang}><div class="max-w-2xl mx-auto mt-10"><h2 class="text-3xl font-bold mb-8">Add New Education</h2><form action="/admin/education" method="POST" class="space-y-4"><div class="grid grid-cols-2 gap-4"><div><label class="block text-sm font-medium mb-1">Institution</label><input type="text" name="institution" required class="w-full p-2 border rounded dark:bg-gray-900 dark:border-gray-700" /></div><div><label class="block text-sm font-medium mb-1">Degree</label><input type="text" name="degree" required class="w-full p-2 border rounded dark:bg-gray-900 dark:border-gray-700" /></div></div><div class="grid grid-cols-2 gap-4"><div><label class="block text-sm font-medium mb-1">Start Date</label><input type="date" name="start_date" required class="w-full p-2 border rounded dark:bg-gray-900 dark:border-gray-700" /></div><div><label class="block text-sm font-medium mb-1">End Date</label><input type="date" name="end_date" class="w-full p-2 border rounded dark:bg-gray-900 dark:border-gray-700" /></div></div><div><label class="block text-sm font-medium mb-1">Description (English)</label><textarea name="description_en" required rows={3} class="w-full p-2 border rounded dark:bg-gray-900 dark:border-gray-700"></textarea></div><div><label class="block text-sm font-medium mb-1">Description (German)</label><textarea name="description_de" required rows={3} class="w-full p-2 border rounded dark:bg-gray-900 dark:border-gray-700"></textarea></div><button type="submit" class="w-full bg-blue-600 text-white py-2 rounded font-bold">Save Education</button></form></div></BaseLayout>)
})

app.post('/admin/education', async (c) => {
  const body = await c.req.parseBody(); const eduId = await createEducation({ start_date: body.start_date as string, end_date: body.end_date as string || null })
  await updateEducationTranslation({ education_id: eduId, language_code: 'en', degree: body.degree as string, institution: body.institution as string, description: body.description_en as string })
  await updateEducationTranslation({ education_id: eduId, language_code: 'de', degree: body.degree as string, institution: body.institution as string, description: body.description_de as string })
  return c.redirect('/admin/education')
})

app.delete('/admin/education/:id', async (c) => { await deleteEducation(parseInt(c.req.param('id'))); return c.text('') })

// Admin - Skills
app.get('/admin/skills', async (c) => {
  const lang = c.get('lang') as string; const skills = await getSkills(lang)
  return c.html(<BaseLayout title="Manage Skills" lang={lang}><div class="max-w-4xl mx-auto mt-10"><div class="flex items-center gap-4 mb-8"><a href="/admin" class="text-blue-600 hover:underline">← Back</a><h2 class="text-3xl font-bold">Manage Skills</h2></div><form hx-post="/admin/skills" hx-target="#skills-list" hx-swap="outerHTML" class="flex gap-4 mb-8"><div><input type="text" name="name_en" placeholder="Skill (EN)" required class="p-2 border rounded dark:bg-gray-900 dark:border-gray-700" /></div><div><input type="text" name="name_de" placeholder="Skill (DE)" required class="p-2 border rounded dark:bg-gray-900 dark:border-gray-700" /></div><div><input type="text" name="category" placeholder="Category" required class="p-2 border rounded dark:bg-gray-900 dark:border-gray-700" /></div><button type="submit" class="bg-blue-600 text-white px-4 rounded font-bold">Add</button></form><div id="skills-list" class="grid grid-cols-1 md:grid-cols-2 gap-4">{skills.map(skill => (<div class="p-3 border rounded dark:border-gray-800 flex justify-between items-center"><span>{skill.name} <span class="text-xs text-gray-500">({skill.category})</span></span><button hx-delete={`/admin/skills/${skill.id}`} hx-target="closest div" hx-swap="outerHTML" class="text-red-600">Delete</button></div>))}</div></div></BaseLayout>)
})

app.post('/admin/skills', async (c) => {
  const body = await c.req.parseBody(); const skillId = await createSkill({ category: body.category as string })
  await updateSkillTranslation({ skill_id: skillId, language_code: 'en', name: body.name_en as string })
  await updateSkillTranslation({ skill_id: skillId, language_code: 'de', name: body.name_de as string })
  const lang = c.get('lang') as string; const skills = await getSkills(lang)
  return c.html(<div id="skills-list" class="grid grid-cols-1 md:grid-cols-2 gap-4">{skills.map(skill => (<div class="p-3 border rounded dark:border-gray-800 flex justify-between items-center"><span>{skill.name} <span class="text-xs text-gray-500">({skill.category})</span></span><button hx-delete={`/admin/skills/${skill.id}`} hx-target="closest div" hx-swap="outerHTML" class="text-red-600">Delete</button></div>))}</div>)
})

app.delete('/admin/skills/:id', async (c) => { await deleteSkill(parseInt(c.req.param('id'))); return c.text('') })

// Admin - Publications
app.get('/admin/publications', async (c) => {
  const lang = c.get('lang') as string; const publications = await getPublications(lang)
  return c.html(<BaseLayout title="Manage Publications" lang={lang}><div class="max-w-4xl mx-auto mt-10"><div class="flex justify-between items-center mb-8"><div class="flex items-center gap-4"><a href="/admin" class="text-blue-600 hover:underline">← Back</a><h2 class="text-3xl font-bold">Manage Publications</h2></div><a href="/admin/publications/add" class="bg-blue-600 text-white px-4 py-2 rounded font-bold">Add New</a></div><div class="space-y-4">{publications.map(pub => (<div class="p-4 border rounded dark:border-gray-800 flex justify-between items-center"><div><h4 class="font-bold">{pub.title} ({pub.year})</h4><p class="text-sm text-gray-500">{pub.venue}</p></div><button hx-delete={`/admin/publications/${pub.id}`} hx-confirm="Are you sure?" hx-target="closest div" hx-swap="outerHTML" class="text-red-600 hover:underline">Delete</button></div>))}</div></div></BaseLayout>)
})

app.get('/admin/publications/add', (c) => {
  const lang = c.get('lang') as string
  return c.html(<BaseLayout title="Add Publication" lang={lang}><div class="max-w-2xl mx-auto mt-10"><h2 class="text-3xl font-bold mb-8">Add New Publication</h2><form action="/admin/publications" method="POST" class="space-y-4"><div><label class="block text-sm font-medium mb-1">Title (EN)</label><input type="text" name="title_en" required class="w-full p-2 border rounded dark:bg-gray-900 dark:border-gray-700" /></div><div><label class="block text-sm font-medium mb-1">Title (DE)</label><input type="text" name="title_de" required class="w-full p-2 border rounded dark:bg-gray-900 dark:border-gray-700" /></div><div class="grid grid-cols-2 gap-4"><div><label class="block text-sm font-medium mb-1">Year</label><input type="number" name="year" required class="w-full p-2 border rounded dark:bg-gray-900 dark:border-gray-700" /></div><div><label class="block text-sm font-medium mb-1">Venue</label><input type="text" name="venue" required class="w-full p-2 border rounded dark:bg-gray-900 dark:border-gray-700" /></div></div><div><label class="block text-sm font-medium mb-1">Authors</label><input type="text" name="authors" required class="w-full p-2 border rounded dark:bg-gray-900 dark:border-gray-700" /></div><div><label class="block text-sm font-medium mb-1">Link</label><input type="text" name="link" class="w-full p-2 border rounded dark:bg-gray-900 dark:border-gray-700" /></div><div><label class="block text-sm font-medium mb-1">Description (English)</label><textarea name="description_en" required rows={3} class="w-full p-2 border rounded dark:bg-gray-900 dark:border-gray-700"></textarea></div><div><label class="block text-sm font-medium mb-1">Description (German)</label><textarea name="description_de" required rows={3} class="w-full p-2 border rounded dark:bg-gray-900 dark:border-gray-700"></textarea></div><button type="submit" class="w-full bg-blue-600 text-white py-2 rounded font-bold">Save Publication</button></form></div></BaseLayout>)
})

app.post('/admin/publications', async (c) => {
  const body = await c.req.parseBody(); const pubId = await createPublication({ year: parseInt(body.year as string), venue: body.venue as string, authors: body.authors as string, link: body.link as string || '' })
  await updatePublicationTranslation({ publication_id: pubId, language_code: 'en', title: body.title_en as string, description: body.description_en as string })
  await updatePublicationTranslation({ publication_id: pubId, language_code: 'de', title: body.title_de as string, description: body.description_de as string })
  return c.redirect('/admin/publications')
})

app.delete('/admin/publications/:id', async (c) => { await deletePublication(parseInt(c.req.param('id'))); return c.text('') })

// Admin - Projects
app.get('/admin/projects', async (c) => {
  const lang = c.get('lang') as string; const projects = await getProjects(lang)
  return c.html(<BaseLayout title="Manage Projects" lang={lang}><div class="max-w-4xl mx-auto mt-10"><div class="flex justify-between items-center mb-8"><div class="flex items-center gap-4"><a href="/admin" class="text-blue-600 hover:underline">← Back</a><h2 class="text-3xl font-bold">Manage Projects</h2></div><a href="/admin/projects/add" class="bg-blue-600 text-white px-4 py-2 rounded font-bold">Add New</a></div><div class="grid grid-cols-1 md:grid-cols-2 gap-4">{projects.map(project => (<div class="p-4 border rounded dark:border-gray-800 flex justify-between items-center"><div><h4 class="font-bold">{project.title}</h4></div><button hx-delete={`/admin/projects/${project.id}`} hx-confirm="Are you sure?" hx-target="closest div" hx-swap="outerHTML" class="text-red-600 hover:underline">Delete</button></div>))}</div></div></BaseLayout>)
})

app.get('/admin/projects/add', (c) => {
  const lang = c.get('lang') as string
  return c.html(<BaseLayout title="Add Project" lang={lang}><div class="max-w-2xl mx-auto mt-10"><h2 class="text-3xl font-bold mb-8">Add New Project</h2><form action="/admin/projects" method="POST" class="space-y-4"><div><label class="block text-sm font-medium mb-1">Title (EN)</label><input type="text" name="title_en" required class="w-full p-2 border rounded dark:bg-gray-900 dark:border-gray-700" /></div><div><label class="block text-sm font-medium mb-1">Title (DE)</label><input type="text" name="title_de" required class="w-full p-2 border rounded dark:bg-gray-900 dark:border-gray-700" /></div><div><label class="block text-sm font-medium mb-1">Image URL</label><input type="text" name="image_url" class="w-full p-2 border rounded dark:bg-gray-900 dark:border-gray-700" /></div><div class="grid grid-cols-2 gap-4"><div><label class="block text-sm font-medium mb-1">GitHub URL</label><input type="text" name="github_url" class="w-full p-2 border rounded dark:bg-gray-900 dark:border-gray-700" /></div><div><label class="block text-sm font-medium mb-1">Live URL</label><input type="text" name="live_url" class="w-full p-2 border rounded dark:bg-gray-900 dark:border-gray-700" /></div></div><div><label class="block text-sm font-medium mb-1">Description (English)</label><textarea name="description_en" required rows={3} class="w-full p-2 border rounded dark:bg-gray-900 dark:border-gray-700"></textarea></div><div><label class="block text-sm font-medium mb-1">Description (German)</label><textarea name="description_de" required rows={3} class="w-full p-2 border rounded dark:bg-gray-900 dark:border-gray-700"></textarea></div><button type="submit" class="w-full bg-blue-600 text-white py-2 rounded font-bold">Save Project</button></form></div></BaseLayout>)
})

app.post('/admin/projects', async (c) => {
  const body = await c.req.parseBody(); const projId = await createProject({ image_url: body.image_url as string || '', github_url: body.github_url as string || '', live_url: body.live_url as string || '' })
  await updateProjectTranslation({ project_id: projId, language_code: 'en', title: body.title_en as string, description: body.description_en as string })
  await updateProjectTranslation({ project_id: projId, language_code: 'de', title: body.title_de as string, description: body.description_de as string })
  return c.redirect('/admin/projects')
})

app.delete('/admin/projects/:id', async (c) => { await deleteProject(parseInt(c.req.param('id'))); return c.text('') })

export default { port: 3001, fetch: app.fetch }

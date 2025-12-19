import db from './index'

export async function upsertProfile(data: {
    email: string;
    phone: string;
    github_url: string;
    linkedin_url: string;
}) {
    const existing = await db.get("SELECT id FROM profile WHERE id = 1")
    if (existing) {
        await db.run(`
            UPDATE profile 
            SET email = ?, phone = ?, github_url = ?, linkedin_url = ?
            WHERE id = 1
        `, [data.email, data.phone, data.github_url, data.linkedin_url])
        return 1
    } else {
        const result = await db.get(`
            INSERT INTO profile (email, phone, github_url, linkedin_url)
            VALUES (?, ?, ?, ?)
            RETURNING id
        `, [data.email, data.phone, data.github_url, data.linkedin_url]) as { id: number }
        return result.id
    }
}

export async function upsertProfileTranslation(data: {
    profile_id: number;
    language_code: string;
    name: string;
    title: string;
    about_me: string;
    location: string;
}) {
    const existing = await db.get(`
        SELECT id FROM profile_translations 
        WHERE profile_id = ? AND language_code = ?
    `, [data.profile_id, data.language_code])

    if (existing) {
        await db.run(`
            UPDATE profile_translations
            SET name = ?, title = ?, about_me = ?, location = ?
            WHERE profile_id = ? AND language_code = ?
        `, [data.name, data.title, data.about_me, data.location, data.profile_id, data.language_code])
    } else {
        await db.run(`
            INSERT INTO profile_translations (profile_id, language_code, name, title, about_me, location)
            VALUES (?, ?, ?, ?, ?, ?)
        `, [data.profile_id, data.language_code, data.name, data.title, data.about_me, data.location])
    }
}

export async function createExperience(data: {
    start_date: string;
    end_date: string | null;
    company_url: string;
}) {
    const result = await db.get(`
        INSERT INTO experience (start_date, end_date, company_url)
        VALUES (?, ?, ?)
        RETURNING id
    `, [data.start_date, data.end_date, data.company_url]) as { id: number }
    return result.id
}

export async function updateExperienceTranslation(data: {
    experience_id: number;
    language_code: string;
    job_title: string;
    company_name: string;
    description: string;
}) {
    const existing = await db.get(`
        SELECT id FROM experience_translations 
        WHERE experience_id = ? AND language_code = ?
    `, [data.experience_id, data.language_code])

    if (existing) {
        await db.run(`
            UPDATE experience_translations
            SET job_title = ?, company_name = ?, description = ?
            WHERE experience_id = ? AND language_code = ?
        `, [data.job_title, data.company_name, data.description, data.experience_id, data.language_code])
    } else {
        await db.run(`
            INSERT INTO experience_translations (experience_id, language_code, job_title, company_name, description)
            VALUES (?, ?, ?, ?, ?)
        `, [data.experience_id, data.language_code, data.job_title, data.company_name, data.description])
    }
}

export async function deleteExperience(id: number) {
    await db.run("DELETE FROM experience WHERE id = ?", [id])
}

export async function createSkill(data: { category: string }) {
    const result = await db.get("INSERT INTO skills (category) VALUES (?) RETURNING id", [data.category]) as { id: number }
    return result.id
}

export async function updateSkillTranslation(data: { skill_id: number, language_code: string, name: string }) {
    const existing = await db.get("SELECT id FROM skill_translations WHERE skill_id = ? AND language_code = ?", [data.skill_id, data.language_code])
    if (existing) {
        await db.run("UPDATE skill_translations SET name = ? WHERE skill_id = ? AND language_code = ?", [data.name, data.skill_id, data.language_code])
    } else {
        await db.run("INSERT INTO skill_translations (skill_id, language_code, name) VALUES (?, ?, ?)", [data.skill_id, data.language_code, data.name])
    }
}

export async function deleteSkill(id: number) {
    await db.run("DELETE FROM skills WHERE id = ?", [id])
}

export async function createEducation(data: {
    start_date: string;
    end_date: string | null;
}) {
    const result = await db.get(`
        INSERT INTO education (start_date, end_date)
        VALUES (?, ?)
        RETURNING id
    `, [data.start_date, data.end_date]) as { id: number }
    return result.id
}

export async function updateEducationTranslation(data: {
    education_id: number;
    language_code: string;
    degree: string;
    institution: string;
    description: string;
}) {
    // Note: INSERT OR REPLACE is SQLite specific. For Postgres we'd use ON CONFLICT.
    // To stay generic, we check exists first as we do in other places.
    const existing = await db.get("SELECT id FROM education_translations WHERE education_id = ? AND language_code = ?", [data.education_id, data.language_code]);
    if (existing) {
        await db.run(`
            UPDATE education_translations SET degree = ?, institution = ?, description = ?
            WHERE education_id = ? AND language_code = ?
        `, [data.degree, data.institution, data.description, data.education_id, data.language_code]);
    } else {
        await db.run(`
            INSERT INTO education_translations (education_id, language_code, degree, institution, description)
            VALUES (?, ?, ?, ?, ?)
        `, [data.education_id, data.language_code, data.degree, data.institution, data.description]);
    }
}

export async function deleteEducation(id: number) {
    await db.run("DELETE FROM education WHERE id = ?", [id])
}

export async function createProject(data: {
    image_url: string;
    github_url: string;
    live_url: string;
}) {
    const result = await db.get(`
        INSERT INTO projects (image_url, github_url, live_url)
        VALUES (?, ?, ?)
        RETURNING id
    `, [data.image_url, data.github_url, data.live_url]) as { id: number }
    return result.id
}

export async function updateProjectTranslation(data: {
    project_id: number;
    language_code: string;
    title: string;
    description: string;
}) {
    const existing = await db.get("SELECT id FROM project_translations WHERE project_id = ? AND language_code = ?", [data.project_id, data.language_code]);
    if (existing) {
        await db.run(`
            UPDATE project_translations SET title = ?, description = ?
            WHERE project_id = ? AND language_code = ?
        `, [data.title, data.description, data.project_id, data.language_code]);
    } else {
        await db.run(`
            INSERT INTO project_translations (project_id, language_code, title, description)
            VALUES (?, ?, ?, ?)
        `, [data.project_id, data.language_code, data.title, data.description]);
    }
}

export async function deleteProject(id: number) {
    await db.run("DELETE FROM projects WHERE id = ?", [id])
}

export async function createPublication(data: {
    year: number;
    venue: string;
    authors: string;
    link: string;
}) {
    const result = await db.get(`
        INSERT INTO publications (year, venue, authors, link)
        VALUES (?, ?, ?, ?)
        RETURNING id
    `, [data.year, data.venue, data.authors, data.link]) as { id: number }
    return result.id
}

export async function updatePublicationTranslation(data: {
    publication_id: number;
    language_code: string;
    title: string;
    description: string;
}) {
    const existing = await db.get("SELECT id FROM publication_translations WHERE publication_id = ? AND language_code = ?", [data.publication_id, data.language_code]);
    if (existing) {
        await db.run(`
            UPDATE publication_translations SET title = ?, description = ?
            WHERE publication_id = ? AND language_code = ?
        `, [data.title, data.description, data.publication_id, data.language_code]);
    } else {
        await db.run(`
            INSERT INTO publication_translations (publication_id, language_code, title, description)
            VALUES (?, ?, ?, ?)
        `, [data.publication_id, data.language_code, data.title, data.description]);
    }
}

export async function deletePublication(id: number) {
    await db.run("DELETE FROM publications WHERE id = ?", [id])
}

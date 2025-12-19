import db from './index'

export interface Profile {
    id: number;
    email: string;
    phone: string;
    github_url: string;
    linkedin_url: string;
    name: string;
    title: string;
    about_me: string;
    location: string;
    language_code: string;
}

export interface Experience {
    id: number;
    start_date: string;
    end_date: string | null;
    company_url: string;
    job_title: string;
    company_name: string;
    description: string;
}

export interface Education {
    id: number;
    start_date: string;
    end_date: string | null;
    degree: string;
    institution: string;
    description: string;
}

export interface Skill {
    id: number;
    category: string;
    name: string;
}

export interface Project {
    id: number;
    image_url: string;
    github_url: string;
    live_url: string;
    title: string;
    description: string;
}

export interface Publication {
    id: number;
    year: number;
    venue: string;
    authors: string;
    link: string;
    title: string;
    description: string;
}

export async function getProfile(lang: string): Promise<Profile | null> {
    return await db.get(`
        SELECT p.*, pt.name, pt.title, pt.about_me, pt.location, pt.language_code
        FROM profile p
        JOIN profile_translations pt ON p.id = pt.profile_id
        WHERE pt.language_code = ?
        LIMIT 1
    `, [lang])
}

export async function getExperiences(lang: string): Promise<Experience[]> {
    return await db.all(`
        SELECT e.*, et.job_title, et.company_name, et.description
        FROM experience e
        JOIN experience_translations et ON e.id = et.experience_id
        WHERE et.language_code = ?
        ORDER BY e.sort_order ASC, e.start_date DESC
    `, [lang])
}

export async function getEducation(lang: string): Promise<Education[]> {
    return await db.all(`
        SELECT ed.*, edt.degree, edt.institution, edt.description
        FROM education ed
        JOIN education_translations edt ON ed.id = edt.education_id
        WHERE edt.language_code = ?
        ORDER BY ed.sort_order ASC, ed.start_date DESC
    `, [lang])
}

export async function getSkills(lang: string): Promise<Skill[]> {
    return await db.all(`
        SELECT s.*, st.name
        FROM skills s
        JOIN skill_translations st ON s.id = st.skill_id
        WHERE st.language_code = ?
        ORDER BY s.category, s.sort_order ASC
    `, [lang])
}

export async function getProjects(lang: string): Promise<Project[]> {
    return await db.all(`
        SELECT pr.*, pt.title, pt.description
        FROM projects pr
        JOIN project_translations pt ON pr.id = pt.project_id
        WHERE pt.language_code = ?
        ORDER BY pr.sort_order ASC
    `, [lang])
}

export async function getPublications(lang: string): Promise<Publication[]> {
    return await db.all(`
        SELECT p.*, pt.title, pt.description
        FROM publications p
        JOIN publication_translations pt ON p.id = pt.publication_id
        WHERE pt.language_code = ?
        ORDER BY p.year DESC, p.sort_order ASC
    `, [lang])
}

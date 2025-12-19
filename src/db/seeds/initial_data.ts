import db from '../index'
import { 
    upsertProfile, upsertProfileTranslation, 
    createExperience, updateExperienceTranslation, 
    createSkill, updateSkillTranslation,
    createProject, updateProjectTranslation,
    createPublication, updatePublicationTranslation
} from '../mutations'

async function seed() {
    console.log('Seeding real CV data...')

    // Clear existing data
    await db.run('DELETE FROM experience')
    await db.run('DELETE FROM experience_translations')
    await db.run('DELETE FROM skills')
    await db.run('DELETE FROM skill_translations')
    await db.run('DELETE FROM profile')
    await db.run('DELETE FROM profile_translations')
    await db.run('DELETE FROM education')
    await db.run('DELETE FROM education_translations')
    await db.run('DELETE FROM projects')
    await db.run('DELETE FROM project_translations')
    await db.run('DELETE FROM publications')
    await db.run('DELETE FROM publication_translations')

    const profileId = await upsertProfile({
        email: 'tuan-dat.tran@dextradata.com',
        phone: '+49 123 456789',
        github_url: 'https://github.com/tudattr',
        linkedin_url: 'https://linkedin.com/in/tuan-dat-tran'
    })

    await upsertProfileTranslation({
        profile_id: profileId,
        language_code: 'en',
        name: 'Tuan-Dat Tran',
        title: 'DevOps Engineer',
        about_me: 'DevOps Engineer passionate about cloud-based infrastructure, Kubernetes, and Infrastructure as Code.',
        location: 'Germany'
    })

    await upsertProfileTranslation({
        profile_id: profileId,
        language_code: 'de',
        name: 'Tuan-Dat Tran',
        title: 'DevOps Engineer',
        about_me: 'DevOps Engineer mit Leidenschaft für cloudbasierte Infrastruktur, Kubernetes und Infrastructure as Code.',
        location: 'Deutschland'
    })

    const experiences = [
        {
            start_date: '2025-01-01',
            end_date: null,
            company_name: 'DextraData',
            company_url: 'https://dextradata.com',
            job_title_en: 'DevOps Engineer',
            job_title_de: 'DevOps Engineer',
            desc_en: 'Responsible for the cloud-based infrastructure hosting a diverse portfolio of SaaS products. Collaborating with developers and customer success teams to ensure operational excellence. Managing Kubernetes cluster deployments, monitoring health metrics, and implementing IaC solutions.',
            desc_de: 'Verantwortlich für die cloudbasierte Infrastruktur eines vielfältigen Portfolios an SaaS-Produkten. Zusammenarbeit mit Entwicklern und Customer Success Teams zur Sicherstellung exzellenter Betriebsabläufe. Verwaltung von Kubernetes-Cluster-Deployments, Überwachung von Metriken und Implementierung von IaC-Lösungen.',
            skills: ['Kubernetes', 'ArgoCD', 'Ansible', 'Azure', 'ELK', 'Helm']
        },
        {
            start_date: '2021-01-01',
            end_date: '2024-12-31',
            company_name: 'UDE (University Duisburg-Essen)',
            company_url: 'https://www.uni-due.de',
            job_title_en: 'Research Assistant',
            job_title_de: 'Wissenschaftlicher Mitarbeiter',
            desc_en: 'Assisted in research around software defined networking, 5G, congestion control algorithms and federated machine learning. Managed on-premise and cloud infrastructure, inventory systems and online presence for the research group.',
            desc_de: 'Unterstützung in der Forschung zu Software Defined Networking, 5G, Congestion Control Algorithmen und Federated Machine Learning. Verwaltung der On-Premise- und Cloud-Infrastruktur, Inventarsysteme und Online-Präsenz der Forschungsgruppe.',
            skills: ['Rust', 'Python', 'P4', 'Linux', 'Docker', 'Kubernetes']
        },
        {
            start_date: '2021-01-01',
            end_date: '2022-12-31',
            company_name: 'UDE',
            company_url: 'https://www.uni-due.de',
            job_title_en: 'Mentoring',
            job_title_de: 'Mentoring',
            desc_en: 'Introduced groups of ~20 freshmen to their new academic environment. Offered organizational and technical guidance for their first year in university.',
            desc_de: 'Einführung von Gruppen von ca. 20 Erstsemestern in ihr neues akademisches Umfeld. Unterstützung bei organisatorischen und technischen Fragen im ersten Studienjahr.',
            skills: ['Powerpoint']
        },
        {
            start_date: '2018-01-01',
            end_date: '2020-12-31',
            company_name: 'gefeba Engineering GmbH',
            company_url: 'https://gefeba.de',
            job_title_en: 'Software Engineer',
            job_title_de: 'Softwareentwickler',
            desc_en: 'Worked on a frame-based data exchange system to monitor industry machinery. Developed a real-time log visualization application.',
            desc_de: 'Arbeit an einem Frame-basierten Datenaustauschsystem zur Überwachung von Industriemaschinen. Entwicklung einer Echtzeit-Log-Visualisierungsanwendung.',
            skills: ['C#', 'Angular', 'Bootstrap', 'Entity Framework']
        },
        {
            start_date: '2016-01-01',
            end_date: '2019-12-31',
            company_name: 'UDE (Student Council)',
            company_url: 'https://www.uni-due.de',
            job_title_en: 'Student Council Member (Volunteer)',
            job_title_de: 'Fachschaftsmitglied (Ehrenamtlich)',
            desc_en: 'Participated in faculty committees and organized social events. Managed IT infrastructure and supported students with organizational or subject-specific issues.',
            desc_de: 'Teilnahme an Fakultätsgremien und Organisation sozialer Events. Verwaltung der IT-Infrastruktur und Unterstützung von Studierenden bei organisatorischen oder fachspezifischen Problemen.',
            skills: ['Linux', 'Networking', 'LaTeX']
        },
        {
            start_date: '2013-01-01',
            end_date: '2015-12-31',
            company_name: 'gefeba Engineering GmbH',
            company_url: 'https://gefeba.de',
            job_title_en: 'Software Engineer',
            job_title_de: 'Softwareentwickler',
            desc_en: 'Worked on internal ERP projects, designed a mail management tool for project traffic, and developed internal master data management tools.',
            desc_de: 'Arbeit an internen ERP-Projekten, Entwurf eines Mail-Management-Tools für den Projektverkehr und Entwicklung interner Stammdaten-Management-Tools.',
            skills: ['C#', 'HTML', 'Javascript', 'CSS']
        }
    ]

    const skillCategories: Record<string, string> = {
        'Kubernetes': 'Infrastructure',
        'ArgoCD': 'DevOps',
        'Ansible': 'Automation',
        'Azure': 'Cloud',
        'ELK': 'Monitoring',
        'Helm': 'Infrastructure',
        'Rust': 'Development',
        'Python': 'Development',
        'P4': 'Networking',
        'Linux': 'OS',
        'Docker': 'Infrastructure',
        'C#': 'Development',
        'Angular': 'Frontend',
        'Bootstrap': 'Frontend',
        'Entity Framework': 'Backend',
        'Networking': 'Networking',
        'LaTeX': 'Tools',
        'Powerpoint': 'Tools',
        'HTML': 'Frontend',
        'Javascript': 'Development',
        'CSS': 'Frontend'
    }

    for (const exp of experiences) {
        const expId = await createExperience({
            start_date: exp.start_date,
            end_date: exp.end_date,
            company_url: exp.company_url
        })
        await updateExperienceTranslation({
            experience_id: expId,
            language_code: 'en',
            job_title: exp.job_title_en,
            company_name: exp.company_name,
            description: exp.desc_en
        })
        await updateExperienceTranslation({
            experience_id: expId,
            language_code: 'de',
            job_title: exp.job_title_de,
            company_name: exp.company_name,
            description: exp.desc_de
        })

        for (const skillName of exp.skills) {
            const existing = await db.get("SELECT s.id FROM skills s JOIN skill_translations st ON s.id = st.skill_id WHERE st.name = ?", [skillName]) as { id: number }
            if (!existing) {
                const skillId = await createSkill({ category: skillCategories[skillName] || 'General' })
                await updateSkillTranslation({ skill_id: skillId, language_code: 'en', name: skillName })
                await updateSkillTranslation({ skill_id: skillId, language_code: 'de', name: skillName })
            }
        }
    }

    const pub1 = await createPublication({
        year: 2023,
        venue: 'IEEE LCN 2023',
        authors: 'N. Baganal-Krishna, T.-D. Tran, R. Kundel and A. Rizk',
        link: ''
    })
    await updatePublicationTranslation({
        publication_id: pub1,
        language_code: 'en',
        title: 'RPM: Reverse Path Congestion Marking on P4 Programmable Switches',
        description: 'We present Reverse Path Congestion Marking (RPM) to accelerate the reaction to network congestion events without changing the end-host stack. We show that RPM improves throughput fairness for RTT on heterogeneous TCP flows.'
    })
    await updatePublicationTranslation({
        publication_id: pub1,
        language_code: 'de',
        title: 'RPM: Reverse Path Congestion Marking on P4 Programmable Switches',
        description: 'Wir präsentieren Reverse Path Congestion Marking (RPM), um die Reaktion auf Netzwerküberlastungsereignisse zu beschleunigen, ohne den End-Host-Stack zu ändern. Wir zeigen, dass RPM die Durchsatzfairness für RTT bei heterogenen TCP-Flows verbessert.'
    })

    const pub2 = await createPublication({
        year: 2022,
        venue: 'Seminar',
        authors: 'Tuan-Dat Tran',
        link: ''
    })
    await updatePublicationTranslation({
        publication_id: pub2,
        language_code: 'en',
        title: 'Overview of IoT Fuzzing Techniques',
        description: 'Comparing techniques used by IoT fuzzers to circumvent the challenges presented by IoT devices and the constraints of the solutions proposed by the IoT fuzzers.'
    })
    await updatePublicationTranslation({
        publication_id: pub2,
        language_code: 'de',
        title: 'Überblick über IoT-Fuzzing-Techniken',
        description: 'Vergleich von Techniken, die von IoT-Fuzzern verwendet werden, um die Herausforderungen von IoT-Geräten und die Einschränkungen der von den IoT-Fuzzern vorgeschlagenen Lösungen zu umgehen.'
    })

    const projects = [
        {
            title_en: 'Undisclosed Ethereum Smart Contract Fuzzer',
            title_de: 'Nicht veröffentlichter Ethereum Smart Contract Fuzzer',
            description_en: 'Building an Ethereum Smart Contract Fuzzer as part of a Bachelor Project/Thesis.',
            description_de: 'Bau eines Ethereum Smart Contract Fuzzers im Rahmen eines Bachelorprojekts/einer Bachelorarbeit.',
            github_url: '',
            live_url: ''
        },
        {
            title_en: '.dotfiles',
            title_de: '.dotfiles',
            description_en: 'Configuration files for Linux systems (ArchLinux). Documentation on setup for repeatability.',
            description_de: 'Konfigurationsdateien für Linux-Systeme (ArchLinux). Dokumentation zur Einrichtung für Wiederholbarkeit.',
            github_url: 'https://github.com/tudattr/dotfiles',
            live_url: ''
        },
        {
            title_en: 'Homelab',
            title_de: 'Homelab',
            description_en: 'Ansible-based automation for provisioning, configuration management, and application deployment in a personal homelab.',
            description_de: 'Ansible-basierte Automatisierung für Provisionierung, Konfigurationsmanagement und Anwendungs-Deployment in einem persönlichen Homelab.',
            github_url: 'https://github.com/tudattr/homelab',
            live_url: ''
        },
        {
            title_en: 'This Website',
            title_de: 'Diese Webseite',
            description_en: 'A full-stack site built with Hono, HTMX, and TailwindCSS.',
            description_de: 'Eine Full-Stack-Seite, die mit Hono, HTMX und TailwindCSS erstellt wurde.',
            github_url: 'https://github.com/tudattr/athomev2',
            live_url: 'http://localhost:3001'
        }
    ]

    for (const proj of projects) {
        const projId = await createProject({
            image_url: '',
            github_url: proj.github_url,
            live_url: proj.live_url
        })
        await updateProjectTranslation({
            project_id: projId,
            language_code: 'en',
            title: proj.title_en,
            description: proj.description_en
        })
        await updateProjectTranslation({
            project_id: projId,
            language_code: 'de',
            title: proj.title_de,
            description: proj.description_de
        })
    }

    console.log('Seeding complete.')
}

seed().catch(console.error);

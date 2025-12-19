import db from './index'
import { readFileSync, readdirSync } from 'fs'
import { join } from 'path'

export async function migrate() {
    const migrationsDir = join(import.meta.dir, 'migrations')
    const files = readdirSync(migrationsDir).filter(f => f.endsWith('.sql')).sort()

    console.log('Running migrations...')
    
    // Simple migration tracking table
    const isPostgres = process.env.DB_TYPE === 'postgres';
    const createMigrationsTable = isPostgres 
        ? `CREATE TABLE IF NOT EXISTS migrations (id SERIAL PRIMARY KEY, name TEXT UNIQUE, applied_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP)`
        : `CREATE TABLE IF NOT EXISTS migrations (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT UNIQUE, applied_at DATETIME DEFAULT CURRENT_TIMESTAMP)`;
    
    await db.run(createMigrationsTable);

    for (const file of files) {
        const applied = await db.get(`SELECT 1 FROM migrations WHERE name = ?`, [file]);
        if (!applied) {
            console.log(`Applying ${file}...`);
            let sql = readFileSync(join(migrationsDir, file), 'utf8');
            
            // Basic translation for common differences if using Postgres
            if (isPostgres) {
                sql = sql.replace(/INTEGER PRIMARY KEY AUTOINCREMENT/g, 'SERIAL PRIMARY KEY');
                sql = sql.replace(/DATETIME/g, 'TIMESTAMP');
            }

            // Note: Transactions are handled differently in the adapter currently.
            // For migrations, we run them sequentially.
            try {
                // Split multi-statement SQL if needed (basic support)
                const statements = sql.split(';').map(s => s.trim()).filter(s => s.length > 0);
                for (const statement of statements) {
                    await db.run(statement);
                }
                await db.run(`INSERT INTO migrations (name) VALUES (?)`, [file]);
            } catch (e) {
                console.error(`Failed to apply ${file}:`, e);
                process.exit(1);
            }
        }
    }
    console.log('Migrations complete.');
}

if (import.meta.main) {
    migrate().catch(console.error);
}
import { Database as SQLiteDatabase } from 'bun:sqlite';
import postgres from 'postgres';

export interface DatabaseAdapter {
    query<T>(sql: string, params?: any[]): {
        all(): T[];
        get(): T | null;
        run(): void;
    };
    transaction<T>(cb: () => T): () => T;
}

const DB_TYPE = process.env.DB_TYPE || 'sqlite';

let adapter: DatabaseAdapter;

if (DB_TYPE === 'postgres') {
    const sql = postgres(process.env.DATABASE_URL!);
    
    adapter = {
        query: <T>(query: string, params: any[] = []) => {
            // Convert ? placeholders to $1, $2... for Postgres
            let count = 0;
            const pgSql = query.replace(/\?/g, () => `$${++count}`);
            
            return {
                all: () => {
                    const result = sql.unsafe(pgSql, params) as any;
                    // Note: postgres.js is async, but our current sync SQLite architecture
                    // makes this tricky. For a true multi-db setup in a sync-heavy 
                    // Bun app, we'd ideally move to async throughout.
                    // However, we can use Bun's await if we make the adapter methods async.
                    throw new Error("Postgres adapter requires async calls. Migration to async needed.");
                },
                get: () => {
                    throw new Error("Postgres adapter requires async calls.");
                },
                run: () => {
                    throw new Error("Postgres adapter requires async calls.");
                }
            };
        },
        transaction: (cb) => {
            return () => {
                let result: any;
                sql.begin(async (s) => {
                    result = await cb();
                });
                return result;
            };
        }
    };
} else {
    const db = new SQLiteDatabase('data/database.sqlite', { create: true });
    adapter = {
        query: <T>(sql: string, params: any[] = []) => ({
            all: () => db.query(sql).all(...params) as T[],
            get: () => db.query(sql).get(...params) as T | null,
            run: () => db.run(sql, params)
        }),
        transaction: (cb) => db.transaction(cb)
    };
}

// Since Postgres is inherently async and Bun:SQLite is sync, 
// a robust switcher should be Async-first. 
// Let's rewrite the adapter to be Async and update the queries.

export interface AsyncDatabaseAdapter {
    all<T>(sql: string, params?: any[]): Promise<T[]>;
    get<T>(sql: string, params?: any[]): Promise<T | null>;
    run(sql: string, params?: any[]): Promise<void>;
}

const createAdapter = (): AsyncDatabaseAdapter => {
    if (DB_TYPE === 'postgres') {
        const sql = postgres(process.env.DATABASE_URL!);
        return {
            all: async (query, params = []) => {
                let count = 0;
                const pgSql = query.replace(/\?/g, () => `$${++count}`);
                return await sql.unsafe(pgSql, params);
            },
            get: async (query, params = []) => {
                let count = 0;
                const pgSql = query.replace(/\?/g, () => `$${++count}`);
                const rows = await sql.unsafe(pgSql, params);
                return (rows[0] as any) || null;
            },
            run: async (query, params = []) => {
                let count = 0;
                const pgSql = query.replace(/\?/g, () => `$${++count}`);
                await sql.unsafe(pgSql, params);
            }
        };
    } else {
        const db = new SQLiteDatabase('data/database.sqlite', { create: true });
        return {
            all: async (sql, params = []) => db.query(sql).all(...params) as any[],
            get: async (sql, params = []) => db.query(sql).get(...params) as any,
            run: async (sql, params = []) => { db.run(sql, params) }
        };
    }
};

export default createAdapter();
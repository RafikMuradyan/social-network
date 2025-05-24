import { Pool } from 'pg';
import * as fs from 'fs';
import * as path from 'path';
import * as dotenv from 'dotenv';

dotenv.config();

async function runMigrations(): Promise<void> {
  const pool = new Pool({
    user: process.env.DB_USER || 'postgres',
    host: process.env.DB_HOST || 'localhost',
    database: process.env.DB_NAME || 'social_network',
    password: process.env.DB_PASSWORD || 'postgres',
    port: parseInt(process.env.DB_PORT || '5432'),
    ssl: true,
  });

  try {
    const filePath = path.resolve(__dirname, '../migrations/init-tables.sql');

    if (!fs.existsSync(filePath)) {
      throw new Error(`file not found at ${filePath}`);
    }

    const sql = fs.readFileSync(filePath, 'utf8');

    await pool.query(sql);
  } catch (error) {
    console.error(error);
    process.exit(1);
  } finally {
    await pool.end();
  }
}

runMigrations().catch(() => {
  process.exit(1);
});

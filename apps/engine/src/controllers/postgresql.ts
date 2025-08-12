import { FastifyBaseLogger } from 'fastify'
import { Pool } from 'pg'
import { Logger } from './fastify.js';
 
const pool = new Pool({
  connectionString: process.env.DATABASE_URL
});

const checkTables = async () => {
  const res = await pool.query('SELECT table_name FROM information_schema.tables WHERE table_schema = \'public\'');
  const tables = res.rows.map((row) => row.table_name);
  if(!tables.includes('maps')) {
    await pool.query('CREATE TABLE maps (id UUID PRIMARY KEY, name TEXT UNIQUE NOT NULL, type TEXT, "inputSchema" TEXT, "outputSchema" TEXT, javascript TEXT, "timesRan" INTEGER, "lastRun" TIMESTAMP, "updatedAt" TIMESTAMP, "createdAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP)');
    Logger.info({}, 'Created maps table');
  }
  if(!tables.includes('errored_runs')) {
    await pool.query('CREATE TABLE errored_runs (id UUID PRIMARY KEY, "mapId" UUID REFERENCES maps(id), input TEXT, error TEXT, "createdAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP)');
    Logger.info({}, 'Created errored_runs table');
  }
  if(!tables.includes('runs')) {
    await pool.query('CREATE TABLE runs (id UUID PRIMARY KEY, "mapId" UUID REFERENCES maps(id), input TEXT, output JSONB, "createdAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP)');
    Logger.info({}, 'Created runs table');
  }

  Logger.info({ tables }, 'Tables checked');

  await pool.query('CREATE INDEX IF NOT EXISTS idx_errored_runs_mapId ON errored_runs ("mapId")');
  await pool.query('CREATE INDEX IF NOT EXISTS idx_runs_mapId ON runs ("mapId")');
  await pool.query('CREATE INDEX IF NOT EXISTS idx_maps_name ON maps USING gin ("name" gin_trgm_ops)');

  Logger.info({}, 'Indexes created and checked');
}
checkTables();
 
export const postgresQuery = async <T>(text: string, params: any[], logger?: FastifyBaseLogger): Promise<T> => {
  const start = Date.now();
  const res = await pool.query(text, params);
  const duration = Date.now() - start;

  if(logger){
    logger.debug({ text, duration, rows: res.rowCount }, 'executed query')
  }else{
    Logger.debug({ text, duration, rows: res.rowCount }, 'executed query')
  }

  return res.rows as T;
}
import { FastifyBaseLogger } from 'fastify'
import { Pool } from 'pg'
 
const pool = new Pool()
 
export const query = async (text: string, params: string[], logger?: FastifyBaseLogger) => {
  const start = Date.now();
  const res = await pool.query(text, params);
  const duration = Date.now() - start;

  if(logger){
    logger.debug('executed query', { text, duration, rows: res.rowCount })
  }

  return res;
}
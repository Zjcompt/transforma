import { FastifyReply, FastifyRequest } from "fastify";
import { Fastify } from "../../../../controllers/fastify.js";
import { postgresQuery } from "../../../../controllers/postgresql.js";

/**
 * Get the total number of runs
 */
Fastify.get('/api/v1/reports/total-runs', async (req: FastifyRequest, res: FastifyReply) => {
  try{
    const totalRuns = await postgresQuery<{ total: string }[]>(`
      SELECT COUNT(*) as total
      FROM runs`, [], req.log);
    res.status(200).send({ total: parseInt(totalRuns[0]?.total || '0') });
  } catch (e) {
    req.log.error('Error getting total runs', e);
    res.status(500).send({ error: 'Internal server error' });
  }
});
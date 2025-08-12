import { FastifyReply, FastifyRequest } from "fastify";
import { Fastify } from "../../../../controllers/fastify.js";
import { postgresQuery } from "../../../../controllers/postgresql.js";

/**
 * Get the total number of errors
 */
Fastify.get('/api/v1/reports/total-errors', async (req: FastifyRequest, res: FastifyReply) => {
  try{
    const totalErrors = await postgresQuery<{ total: string }[]>(`
      SELECT COUNT(*) as total
      FROM errored_runs`, [], req.log);
    res.status(200).send({ total: parseInt(totalErrors[0]?.total || '0') });
  } catch (e) {
    req.log.error('Error getting total errors', e);
    res.status(500).send({ error: 'Internal server error' });
  }
});
import { FastifyReply, FastifyRequest } from "fastify";
import { Fastify } from "../../../../controllers/fastify.js";
import { postgresQuery } from "../../../../controllers/postgresql.js";

/**
 * Get the total number of successes
 */
Fastify.get('/api/v1/reports/total-successes', async (req: FastifyRequest, res: FastifyReply) => {
  try{
    const totalSuccesses = await postgresQuery<{ total: string }[]>(`
      SELECT COUNT(*) as total
      FROM runs`, [], req.log);
    res.status(200).send({ total: parseInt(totalSuccesses[0]?.total || '0') });
  } catch (e) {
    req.log.error('Error getting total successes', e);
    res.status(500).send({ error: 'Internal server error' });
  }
});
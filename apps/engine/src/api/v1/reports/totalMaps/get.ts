import { FastifyReply, FastifyRequest } from "fastify";
import { Fastify } from "../../../../controllers/fastify.js";
import { postgresQuery } from "../../../../controllers/postgresql.js";

/**
 * Get the total number of maps
 */
Fastify.get('/api/v1/reports/total-maps', async (req: FastifyRequest, res: FastifyReply) => {
  try{
    const totalMaps = await postgresQuery<{ total: string }[]>(`
      SELECT COUNT(*) as total
      FROM maps`, [], req.log);
    res.status(200).send({ total: parseInt(totalMaps[0]?.total || '0') });
  } catch (e) {
    req.log.error('Error getting total maps', e);
    res.status(500).send({ error: 'Internal server error' });
  }
});
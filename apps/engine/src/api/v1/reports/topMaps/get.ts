import { FastifyReply, FastifyRequest } from "fastify";
import { Fastify } from "../../../../controllers/fastify.js";
import { postgresQuery } from "../../../../controllers/postgresql.js";

/**
 * Get the top 10 maps by times ran
 */
Fastify.get('/api/v1/reports/top-maps', async (req: FastifyRequest, res: FastifyReply) => {
  try{
    const topMaps = await postgresQuery<{ name: string, total: string }[]>(`
      SELECT "timesRan" as total, name
      FROM maps
      ORDER BY "timesRan" DESC
      LIMIT 10`, [], req.log);
    res.status(200).send({ topMaps });
  } catch (e) {
    req.log.error('Error getting top maps', e);
    res.status(500).send({ error: 'Internal server error' });
  }
});
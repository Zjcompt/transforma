import { FastifyReply, FastifyRequest } from "fastify";
import { Fastify } from "../../../../controllers/fastify.js";
import { postgresQuery } from "../../../../controllers/postgresql.js";

/**
 * Get the top 10 maps with the most errors
 */
Fastify.get('/api/v1/reports/most-errors', async (req: FastifyRequest, res: FastifyReply) => {
  try{
    const mostErrors = await postgresQuery<{ name: string, total: string }[]>(`
      SELECT m.name, COUNT(*) as total
      FROM errored_runs er
      JOIN maps m
      ON er."mapId" = m.id
      GROUP BY m.id
      ORDER BY total DESC
      LIMIT 10`, [], req.log);
    res.status(200).send({ mostErrors });
  } catch (e) {
    req.log.error('Error getting most errors', e);
    res.status(500).send({ error: 'Internal server error' });
  }
});
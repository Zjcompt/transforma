import { FastifyReply, FastifyRequest } from "fastify";
import { Fastify } from "../../../../controllers/fastify.js";
import { postgresQuery } from "../../../../controllers/postgresql.js";

Fastify.delete('/api/v1/map/:id', async (req: FastifyRequest, res: FastifyReply) => {
  const { id } = req.params as { id: string };

  // Delete dependent records first to avoid FK constraint errors
  await postgresQuery('DELETE FROM runs WHERE "mapId" = $1', [id]);
  await postgresQuery('DELETE FROM errored_runs WHERE "mapId" = $1', [id]);
  await postgresQuery('DELETE FROM maps WHERE id = $1', [id]);

  res.status(204).send();
});

import { FastifyReply, FastifyRequest } from "fastify";
import { Fastify } from "../../../../controllers/fastify.js";
import Map from "../../../../models/map.js";

Fastify.delete('/api/v1/map/:id', async (req: FastifyRequest, res: FastifyReply) => {
  const { id } = req.params as { id: string };

  const map = await Map.get(id);

  if(!map) {
    return res.status(404).send({ error: 'Map not found' });
  }

  await map.delete();

  res.status(204).send();
});

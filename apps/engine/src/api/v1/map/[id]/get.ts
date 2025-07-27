import { FastifyReply, FastifyRequest } from "fastify";
import { Fastify } from "../../../../controllers/fastify.js";
import Map from "../../../../models/map.js";

Fastify.get('/api/v1/map/:id', async (req: FastifyRequest, res: FastifyReply) => {
  const { id } = req.params as { id: string };

  const map = await Map.get(id);

  res.status(200).send(map);
});
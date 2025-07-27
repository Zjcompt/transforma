import { FastifyReply, FastifyRequest } from "fastify";
import { Fastify } from "../../../controllers/fastify.js";
import Map from "../../../models/map.js";

Fastify.get('/api/v1/map', async (req: FastifyRequest, res: FastifyReply) => {
  const maps = await Map.getAll();

  res.status(200).send(maps);
});
import { FastifyReply, FastifyRequest } from "fastify";
import { Fastify } from "src/controllers/fastify.js";
import Map from "src/models/map.js";
import { postgresQuery } from "src/controllers/postgresql.js";
import { randomUUID } from "crypto";

Fastify.post('/api/v1/map/:id/execute', async (req: FastifyRequest, res: FastifyReply) => {
  const { id } = req.params as { id: string };
  const input = req.body as { input: any };

  req.log.info({ id, input }, 'Executing Map');

  let output: any;
  try{
    const map = await Map.get(id);
    output = await map.run(input);
  }catch(e: any){
    await postgresQuery(`INSERT INTO errored_runs (id, "mapId", input, error) VALUES ($1, $2, $3, $4)`, [randomUUID(), id, JSON.stringify(input), e.message]);
    res.status(500).send({ error: e.message });
    return;
  }

  await postgresQuery(`INSERT INTO runs (id, "mapId", input, output) VALUES ($1, $2, $3, $4)`, [randomUUID(), id, JSON.stringify(input), output]);
  
  res.status(200).send(output);
});
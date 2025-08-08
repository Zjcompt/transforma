import { FastifyReply, FastifyRequest } from "fastify";
import { Fastify, Logger } from "src/controllers/fastify.js";
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
    (async () => {
      try {
        await postgresQuery(`INSERT INTO errored_runs (id, "mapId", input, error) VALUES ($1, $2, $3, $4)`, [randomUUID(), id, JSON.stringify(input), e.message]);
      } catch (e) {
        Logger.error({ id, error: e }, 'Error inserting errored run');
      }
    })();
    let errorMessage;
    try {
      errorMessage = JSON.parse(e.message);
    } catch {
      errorMessage = String(e.message);
    }
    res.status(500).send({ error: errorMessage });
    return;
  }

  (async () => {
    try {
      await postgresQuery(`INSERT INTO runs (id, "mapId", input, output) VALUES ($1, $2, $3, $4)`, [randomUUID(), id, JSON.stringify(input), output]);
    } catch (e) {
      Logger.error({ id, error: e }, 'Error inserting run');
    }
  })();
  
  res.status(200).send(output);
});
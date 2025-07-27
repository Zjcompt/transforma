import { FastifyReply, FastifyRequest } from "fastify";
import { Fastify } from "src/controllers/fastify.js";
import Map from "src/models/map.js";

console.log('Executing Map');

Fastify.post('/api/v1/map/:id/execute', async (req: FastifyRequest, res: FastifyReply) => {
  const { id } = req.params as { id: string };
  const input = req.body as { input: any };

  req.log.info({ id, input }, 'Executing Map');

  let output: any;
  try{
    const map = await Map.get(id);
    output = await map.run(input);
  }catch(e: any){
    res.status(500).send({ error: e.message });
    return;
  }
  
  res.status(200).send(output);
});
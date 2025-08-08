import { FastifyReply, FastifyRequest } from "fastify";
import { Fastify } from "../../../../controllers/fastify.js";
import Map from "../../../../models/map.js";

type Body = {
  name?: string;
  type?: 'jsonSchema' | 'json';
  inputSchema?: string;
  outputSchema?: string;
}

Fastify.put('/api/v1/map/:id', async (req: FastifyRequest, res: FastifyReply) => {
  const { id } = req.params as { id: string };
  const body = req.body as Body;

  if (!body || Object.keys(body).length === 0) {
    return res.status(400).send({ error: 'No fields to update' });
  }

  const map = await Map.get(id);

  if(!map) {
    return res.status(404).send({ error: 'Map not found' });
  }

  let regenJavascript = false;

  if(body.name) {
    map.name = body.name;
  }
  if(body.type) {
    map.type = body.type;
  }
  if(body.inputSchema) {
    map.inputSchema = body.inputSchema;
    regenJavascript = true;
  }
  if(body.outputSchema) {
    map.outputSchema = body.outputSchema;
    regenJavascript = true;
  }

  if(regenJavascript) {
    map.javascript = await map.generateJavascript();
  }

  const updated = await map.update();
  
  res.status(200).send(updated);
});

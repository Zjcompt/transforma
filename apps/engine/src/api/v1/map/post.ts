import { FastifyReply, FastifyRequest } from "fastify";
import { Fastify } from "../../../controllers/fastify.ts";
import Map from "../../../models/map.ts";
import { randomUUID } from 'crypto';

Fastify.post('/api/v1/map', async (req: FastifyRequest, res: FastifyReply) => {
  const { inputSchema, outputSchema, name, type } = req.body as {
    inputSchema: string,
    outputSchema: string,
    name: string,
    type: 'jsonSchema' | 'json'
  }

  if(!inputSchema || !outputSchema || !name || !type) {
    return res.status(400).send({ error: 'Missing required fields' });
  }

  if(typeof inputSchema !== 'string' || typeof outputSchema !== 'string') {
    return res.status(400).send({ error: 'Invalid schema' });
  }

  if(type !== 'jsonSchema' && type !== 'json') {
    return res.status(400).send({ error: 'Invalid type' });
  }


  if(typeof name !== 'string') {
    return res.status(400).send({ error: 'Invalid name' });
  }

  const map = new Map({
    id: randomUUID(),
    name,
    type,
    inputSchema,
    outputSchema,
    javascript: '',
    timesRan: 0,
    lastRun: new Date(),
    updatedAt: new Date(),
    createdAt: new Date()
  });

  await map.create();

  req.log.info({ javascript: map.javascript }, 'Generated JavaScript');

  return res.status(201).send(map);
});
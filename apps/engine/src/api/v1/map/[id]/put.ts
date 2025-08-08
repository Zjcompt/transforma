import { FastifyReply, FastifyRequest } from "fastify";
import { Fastify } from "../../../../controllers/fastify.js";
import { postgresQuery } from "../../../../controllers/postgresql.js";

type Body = {
  name?: string;
  type?: 'jsonSchema' | 'csv';
  inputSchema?: string;
  outputSchema?: string;
}

Fastify.put('/api/v1/map/:id', async (req: FastifyRequest, res: FastifyReply) => {
  const { id } = req.params as { id: string };
  const body = req.body as Body;

  if (!body || Object.keys(body).length === 0) {
    return res.status(400).send({ error: 'No fields to update' });
  }

  const fields: string[] = [];
  const values: any[] = [];
  let idx = 1;

  if (typeof body.name === 'string') { fields.push(`name = $${idx++}`); values.push(body.name); }
  if (typeof body.type === 'string') { fields.push(`type = $${idx++}`); values.push(body.type); }
  if (typeof body.inputSchema === 'string') { fields.push(`"inputSchema" = $${idx++}`); values.push(body.inputSchema); }
  if (typeof body.outputSchema === 'string') { fields.push(`"outputSchema" = $${idx++}`); values.push(body.outputSchema); }

  // Always update updatedAt
  fields.push(`"updatedAt" = NOW()`);

  const query = `UPDATE maps SET ${fields.join(', ')} WHERE id = $${idx} RETURNING *`;
  values.push(id);

  const rows = await postgresQuery<any[]>(query, values);
  const updated = rows[0];
  if (!updated) {
    return res.status(404).send({ error: 'Map not found' });
  }

  res.status(200).send(updated);
});

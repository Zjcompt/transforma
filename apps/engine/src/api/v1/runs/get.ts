import { FastifyReply, FastifyRequest } from "fastify";
import { Fastify } from "../../../controllers/fastify.js";
import { postgresQuery } from "../../../controllers/postgresql.js";
import { IRun } from "@transforma/imports/interfaces/runs.js";

interface QueryParams {
  page?: string;
  limit?: string;
  search?: string;
}

interface PaginatedResponse {
  data: IRun[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

Fastify.get('/api/v1/runs', async (req: FastifyRequest, res: FastifyReply) => {
  const { page = '1', limit = '25', search } = req.query as QueryParams;
  
  const pageNum = Math.max(1, parseInt(page, 10));
  const limitNum = Math.min(100, Math.max(1, parseInt(limit, 10)));
  const offset = (pageNum - 1) * limitNum;
  
  let whereClause = '';
  let queryParams: any[] = [];
  let paramIndex = 1;
  
  if (search && search.trim()) {
    whereClause = 'WHERE input::text ILIKE $1';
    queryParams.push(`%${search.trim()}%`);
    paramIndex++;
  }
  
  const countQuery = `SELECT COUNT(*) as total FROM runs ${whereClause}`;
  const countResult = await postgresQuery<{ total: string }[]>(countQuery, queryParams);
  const total = parseInt(countResult[0]?.total || '0', 10);
  
  const dataQuery = `
    SELECT r.*, m.name as mapName 
    FROM runs r
    LEFT JOIN maps m ON r."mapId" = m.id
    ${whereClause} 
    ORDER BY r."createdAt" DESC 
    LIMIT $${paramIndex} OFFSET $${paramIndex + 1}
  `;
  queryParams.push(limitNum, offset);
  
  const runs = await postgresQuery<(IRun & { mapName: string })[]>(dataQuery, queryParams);
  
  const totalPages = Math.ceil(total / limitNum);
  
  const response: PaginatedResponse = {
    data: runs,
    pagination: {
      page: pageNum,
      limit: limitNum,
      total,
      totalPages,
      hasNext: pageNum < totalPages,
      hasPrev: pageNum > 1
    }
  };
  
  res.status(200).send(response);
});
import { FastifyReply, FastifyRequest } from "fastify";
import { Fastify } from "../../../controllers/fastify.js";
import Map from "../../../models/map.js";

interface QueryParams {
  page?: string;
  limit?: string;
  search?: string;
}

interface PaginatedResponse {
  data: Map[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

Fastify.get('/api/v1/map', async (req: FastifyRequest, res: FastifyReply) => {
  const { page = '1', limit = '25', search } = req.query as QueryParams;
  
  const pageNum = Math.max(1, parseInt(page, 10));
  const limitNum = Math.min(100, Math.max(1, parseInt(limit, 10)));
  
  const result = await Map.getAllPaginated(pageNum, limitNum, search);
  
  const response: PaginatedResponse = {
    data: result.maps,
    pagination: {
      page: pageNum,
      limit: limitNum,
      total: result.total,
      totalPages: Math.ceil(result.total / limitNum),
      hasNext: pageNum < Math.ceil(result.total / limitNum),
      hasPrev: pageNum > 1
    }
  };

  res.status(200).send(response);
});
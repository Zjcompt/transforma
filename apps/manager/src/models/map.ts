import { IMap, IMapClient } from '@transforma/imports/interfaces/map';
import { Pagination } from '@transforma/imports/interfaces/pagination.ts'

type MapRequest = {
  inputSchema: string,
  outputSchema: string,
  name: string,
  type: 'jsonSchema' | 'json'
}

export default class Map implements IMap {
  id: string;
  name: string;
  type: 'json' | 'jsonSchema';
  inputSchema: string;
  outputSchema: string;
  javascript: string;
  timesRan: Number;
  lastRun: Date;
  updatedAt: Date;
  createdAt: Date;

  constructor(map: IMapClient) {
    this.id = map.id;
    this.name = map.name;
    this.type = map.type;
    this.inputSchema = map.inputSchema;
    this.outputSchema = map.outputSchema;
    this.javascript = map.javascript;
    this.timesRan = map.timesRan;
    this.lastRun = new Date(map.lastRun);
    this.updatedAt = new Date(map.updatedAt);
    this.createdAt = new Date(map.createdAt);
  }

  /**
   * Get paginated maps
   * @param page - The page number
   * @param limit - The number of maps per page
   * @param search - The search query
   * @returns The maps and pagination
   */
  static async getMaps(page: number, limit: number, search?: string) {
    const res = await fetch(`http://localhost:3000/api/v1/map?page=${page}&limit=${limit}${search ? `&search=${search}` : ''}`);

    if (!res.ok) {
      const error = await res.json();
      throw new Error(error.error);
    }

    const data = await res.json();

    return {
      maps: data.data.map((map: IMapClient) => new Map(map)),
      pagination: {
        page: data.pagination.page,
        limit: data.pagination.limit,
        total: data.pagination.total,
        totalPages: data.pagination.totalPages,
        hasNext: data.pagination.hasNext,
        hasPrev: data.pagination.hasPrev,
      } as Pagination
    }
  }

  /**
   * Create a newmap
   * @param mapRequest - The map request
   * @param mapRequest.inputSchema - The input schema
   * @param mapRequest.outputSchema - The output schema
   * @param mapRequest.name - The name of the map
   * @param mapRequest.type - The type of the map
   * @returns The created map
   */
  static async create(mapRequest: MapRequest) {
    const res = await fetch(`http://localhost:3000/api/v1/map`, {
      method: 'POST',
      body: JSON.stringify(mapRequest),
    });

    if (!res.ok) {
      const error = await res.json();
      throw new Error(error.error);
    }

    return new Map(await res.json());
  }

  /**
   * Update a map
   * @param mapRequest - The map request
   * @param mapRequest.inputSchema - The input schema
   * @param mapRequest.outputSchema - The output schema
   * @param mapRequest.name - The name of the map
   * @param mapRequest.type - The type of the map
   * @returns The updated map
   */
  async update(mapRequest: MapRequest) {
    const res = await fetch(`http://localhost:3000/api/v1/map/${this.id}`, {
      method: 'PUT',
      body: JSON.stringify(mapRequest),
    });

    if (!res.ok) {
      const error = await res.json();
      throw new Error(error.error);
    }

    return new Map(await res.json());
  }

  /**
   * Delete a map
   * @returns True if the map was deleted
   */
  async delete() {
    const res = await fetch(`http://localhost:3000/api/v1/map/${this.id}`, {
      method: 'DELETE',
    });

    if (!res.ok) {
      const error = await res.json();
      throw new Error(error.error);
    }

    return true;
  }
}
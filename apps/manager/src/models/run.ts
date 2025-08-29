import { IRun } from '@transforma/imports/interfaces/runs.ts';
import { IErroredRun } from '@transforma/imports/interfaces/erroredRun.ts';
import { Pagination } from '@transforma/imports/interfaces/pagination.ts';

export interface IRunClient extends IRun {
  mapName?: string;
}

export interface IErroredRunClient extends IErroredRun {
  mapName?: string;
}

export default class Run implements IRun {
  id: string;
  mapId: string;
  input: object;
  output: object;
  createdAt: Date;
  mapName?: string;

  constructor(run: IRunClient) {
    this.id = run.id;
    this.mapId = run.mapId;
    this.input = run.input;
    this.output = run.output;
    this.mapName = run.mapName;
    this.createdAt = new Date(run.createdAt);
  }

  /**
   * Get paginated runs across all maps
   * @param page - The page number
   * @param limit - The number of runs per page
   * @param search - The search query
   * @returns The runs and pagination
   */
  static async getRuns(page: number, limit: number, search?: string) {
    const res = await fetch(`http://localhost:3000/api/v1/runs?page=${page}&limit=${limit}${search ? `&search=${search}` : ''}`);

    if (!res.ok) {
      const error = await res.json();
      throw new Error(error.error);
    }

    const data = await res.json();

    return {
      runs: data.data.map((run: IRunClient) => new Run(run)),
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
}

export class ErroredRun implements IErroredRun {
  id: string;
  mapId: string;
  input: object;
  error: string;
  createdAt: Date;
  mapName?: string;

  constructor(erroredRun: IErroredRunClient) {
    this.id = erroredRun.id;
    this.mapId = erroredRun.mapId;
    this.input = erroredRun.input;
    this.error = erroredRun.error;
    this.mapName = erroredRun.mapName;
    this.createdAt = new Date(erroredRun.createdAt);
  }

  /**
   * Get paginated errored runs across all maps
   * @param page - The page number
   * @param limit - The number of errored runs per page
   * @param search - The search query
   * @returns The errored runs and pagination
   */
  static async getErroredRuns(page: number, limit: number, search?: string) {
    const res = await fetch(`http://localhost:3000/api/v1/errored-runs?page=${page}&limit=${limit}${search ? `&search=${search}` : ''}`);

    if (!res.ok) {
      const error = await res.json();
      throw new Error(error.error);
    }

    const data = await res.json();

    return {
      erroredRuns: data.data.map((erroredRun: IErroredRunClient) => new ErroredRun(erroredRun)),
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
}
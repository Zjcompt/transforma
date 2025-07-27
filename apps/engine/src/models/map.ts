import { IMap } from '@transforma/imports/interfaces/map.js';
import { createMapFunction } from '../controllers/aiGenerator.js';
import { postgresQuery } from '../controllers/postgresql.js';
import vm from 'vm';
import { executionCache } from 'src/controllers/executionCache.js';
import { Logger } from 'src/controllers/fastify.js';
import fs from 'fs';
import path from 'path';

export default class Map implements IMap {
  id: string;
  name: string;
  type: 'jsonSchema' | 'csv';
  inputSchema: string;
  outputSchema: string;
  javascript: string;
  timesRan: Number;
  lastRun: Date;
  updatedAt: Date;
  createdAt: Date;

  constructor(map: IMap) {  
    this.id = map.id;
    this.name = map.name;
    this.type = map.type;
    this.inputSchema = map.inputSchema;
    this.outputSchema = map.outputSchema;
    this.javascript = map.javascript;
    this.timesRan = map.timesRan;
    this.lastRun = map.lastRun;
    this.updatedAt = map.updatedAt;
    this.createdAt = map.createdAt;
  }

  static async get(id: string) {
    Logger.debug({ id }, 'Getting Map');
    const maps = await postgresQuery<IMap[]>(`SELECT * FROM maps WHERE id = $1`, [id]);
    const map = maps[0];

    if(!map) {
      throw new Error('Map not found');
    }

    Logger.debug({ map }, 'Got Map');
    return new Map(map);
  }

  async create() {
    this.javascript = await this.generateJavascript();
    
    await postgresQuery(`INSERT INTO maps (id, name, type, inputSchema, outputSchema, javascript, timesRan, lastRun, updatedAt, createdAt) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)`, [this.id, this.name, this.type, this.inputSchema, this.outputSchema, this.javascript, this.timesRan, this.lastRun, this.updatedAt, this.createdAt]);

    return this;
  }

  async generateJavascript() {
    const promptPath = path.join(path.resolve(), 'src/prompt.md');
    const promptTemplate = fs.readFileSync(promptPath, 'utf-8');
    
    const systemPrompt = promptTemplate
      .replace('{{inputSchema}}', this.inputSchema)
      .replace('{{outputSchema}}', this.outputSchema)
      .replace('{{type}}', this.type);

    return await createMapFunction('openai', systemPrompt);
  }

  async run(input: any) {
    Logger.debug({ id: this.id, input }, 'Running Map');

    const sandbox = { input };
    let script: vm.Script;
    
    if(executionCache.has(this.id)) {
      Logger.debug({ id: this.id }, 'Using cached script');

      script = executionCache.get(this.id);
    }else{
      Logger.debug({ id: this.id }, 'Creating new script and adding to cache');

      script = new vm.Script(`(${this.javascript})(input)`);
      executionCache.add(this.id, script);
    }

    if(!script) {
      throw new Error('Script not found, something went terribly wrong');
    }

    const output = await script.runInNewContext(sandbox, {
      timeout: 10000
    });

    Logger.debug({
      id: this.id,
      name: this.name,
      input,
      output
    }, 'Executed Map');

    return output;
  }
}
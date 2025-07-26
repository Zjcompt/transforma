import { IMap } from '@transforma/imports/interfaces/map.js';
import { createMapFunction } from '../controllers/aiGenerator.js';
import { postgresQuery } from '../controllers/postgresql.js';

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

  async create() {
    this.javascript = await this.generateJavascript();
    
    await postgresQuery(`INSERT INTO maps (id, name, type, inputSchema, outputSchema, javascript, timesRan, lastRun, updatedAt, createdAt) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)`, [this.id, this.name, this.type, this.inputSchema, this.outputSchema, this.javascript, this.timesRan, this.lastRun, this.updatedAt, this.createdAt]);

    return this;
  }

  async generateJavascript() {
    const javascript = await createMapFunction('openai', `Your job is to generate a JavaScript function that will map an object from the input schema and create an object that conforms to the output schema.
        
        Input Schema: ${this.inputSchema}
        Type: ${this.type}
        Output Schema: ${this.outputSchema}
        Type: ${this.type}
        
        The function should be a valid JavaScript function that can be executed in a Node.js environment.

        The function should be in the following format:
        function transform(inputObject) {
          // Do your mapping here

          return outputObject;
        }

        Make sure to check the input object for any missing or null values and return an error if any are found or for any possible errors that may occur.
        You should not use any external libraries, only use basic JavaScript functions. 
        You should only return the function with no other text or comments or formatting.
    `);

    return javascript;
  }
}
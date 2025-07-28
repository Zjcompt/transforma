export interface IMap {
  id: string,
  name: string,
  type: 'json' | 'jsonSchema',
  inputSchema: string,
  outputSchema: string,
  javascript: string,
  timesRan: Number,
  lastRun: Date,
  updatedAt: Date,
  createdAt: Date
}
export interface IMap {
  id: string,
  name: string,
  type: 'jsonSchema' | 'csv',
  inputSchema: string,
  outputSchema: string,
  javascript: string,
  timesRan: Number,
  lastRun: Date,
  updatedAt: Date,
  createdAt: Date
}
import { createMapFunction as createMapFunctionOpenAI } from "./openai.js";

export const createMapFunction = async (provider: 'openai', systemPrompt: string): Promise<string> => {
  switch(provider) {
    case 'openai':
      return await createMapFunctionOpenAI(systemPrompt);
    default:
      throw new Error(`Provider ${provider} not supported`);
  }
}
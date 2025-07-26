import OpenAI from "openai";
import { z } from "zod";
import { zodTextFormat } from "openai/helpers/zod.js";
import { Logger } from "./fastify.js";

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || '',
});

export const createMapFunction = async (systemPrompt: string): Promise<string> => {
  const schema = z.object({
    text: z.string().describe('The generated JavaScript function'),
    error: z.string().describe('An error message if the function could not be generated')
  });

  const completion = await client.responses.parse({
    model: "gpt-4o-mini",
    input: [
      {
        role: 'system',
        content: systemPrompt
      }
    ],
    text: {
      format: zodTextFormat(schema, 'text')
    }
  });

  Logger.debug(`OpenAI chat completion: ${completion.output_parsed?.text || 'No content returned from OpenAI'}`);

  if(!completion.output_parsed?.text) {
    throw new Error('No content returned from OpenAI');
  }

  if(completion.output_parsed.error) {
    throw new Error(completion.output_parsed.error);
  }

  return completion.output_parsed.text;
}
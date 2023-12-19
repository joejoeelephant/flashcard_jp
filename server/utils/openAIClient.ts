import OpenAI from 'openai';
import { prismaClient } from './prisma';

declare global {
  var _openAIClientInstance: Promise<OpenAI> | undefined;
}

async function initializeOpenAIClient() {
  try {
    const apiKey = await prismaClient.openApiKey.findFirst();
    if (!apiKey || !apiKey.value) {
      throw new Error('API key is not defined in the database');
    }
    return new OpenAI({ apiKey: apiKey.value });
  } catch (error: any) {
    throw new Error(`Failed to initialize OpenAI client: ${error.message}`);
  }
}

if (!global._openAIClientInstance) {
  global._openAIClientInstance = initializeOpenAIClient();
}

// Function to reinitialize the OpenAI client
export async function reinitializeOpenAIClient() {
  global._openAIClientInstance = initializeOpenAIClient();
  return global._openAIClientInstance;
}

export const openAIClient = global._openAIClientInstance;

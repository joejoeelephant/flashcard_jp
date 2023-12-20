import OpenAI from 'openai';
import { prismaClient } from './prisma';

declare global {
  var _openAIClientInstance: OpenAI | undefined;
}

export async function initializeOpenAIClient() {
  try {
    const apiKey = await prismaClient.openApiKey.findFirst();
    if (!apiKey || !apiKey.value) {
      throw new Error('API key is not defined in the database');
    }
    if (!global._openAIClientInstance) {
      global._openAIClientInstance = new OpenAI({ apiKey: apiKey.value });
      return global._openAIClientInstance
    }
    return global._openAIClientInstance
  } catch (error: any) {
    throw new Error(`Failed to initialize OpenAI client: ${error.message}`);
  }
}

export async function getOpenAIClient() {
  if (!global._openAIClientInstance) {
    await initializeOpenAIClient();
  }
  return global._openAIClientInstance;
}
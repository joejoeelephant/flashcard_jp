import { prismaClient } from '../utils/prisma';
import {initializeOpenAIClient} from '../utils/openAIClient'
const checkExist = async () => {
    try {
        const response = await prismaClient.openApiKey.findFirst()
        if(response) {
            return true
        }
        return false
    } catch (error) {
        throw JSON.stringify(error)
    }
}

export default defineEventHandler(async (event) => {
    if(event.context.error) {
        throw createError(event.context.error);
    }

    const {apiKey} = await readBody(event);
    if(!String(apiKey)) {
        throw createError({
            statusCode: 500,
            statusMessage: 'invalid apiKey',
        });
    }
    try {
        const exist = await checkExist()
        if(exist) {
            throw 'apiKey existed'
        }
        const apiKeyResponse = await prismaClient.openApiKey.create({
            data: {
                value: apiKey
            }
        });
        await initializeOpenAIClient();
        
        // Return a simple success message instead of the whole OpenAI client instance
        return {
            statusCode: 200,
            statusMessage: 'API key added successfully and OpenAI client reinitialized',
            body: apiKeyResponse
        };
    } catch (error) {
        throw createError({
            statusCode: 500,
            statusMessage: JSON.stringify(error)
        });
    }
})
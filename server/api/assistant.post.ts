import { prismaClient } from '../utils/prisma';
import {createAssistantInDB} from '../utils/assistant.util'

export default defineEventHandler(async (event) => {
    if(event.context.error) {
        throw createError(event.context.error);
    }

    try {
        const response = await createAssistantInDB()
        return {
            statusCode: 200,
            statusMessage: 'assistant added successfully',
            body: response
        }
    } catch (error) {
        throw createError({
            statusCode: 400,
            statusMessage: JSON.stringify(error),
        });
    }
});

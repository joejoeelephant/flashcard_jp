import { prismaClient } from '../utils/prisma';


export default defineEventHandler(async (event) => {
    if (event.context.error) {
        throw createError(event.context.error);
    }

    try {
        const assistant = await prismaClient.assistant.findFirst()
        return {
            statusCode: 200,
            statusMessage: 'success',
            body: assistant
        }
    } catch (error) {
        throw createError({
            statusCode: 400,
            statusMessage: JSON.stringify(error),
        });
    }
});
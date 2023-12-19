import { prismaClient } from '../utils/prisma';

export default defineEventHandler(async (event) => {
    if(event.context.error) {
        throw createError(event.context.error);
    }

    const { openApiKeyId } = getQuery(event)

    if(isNaN(Number(openApiKeyId))) {
        throw createError({
            statusCode: 500,
            statusMessage: 'invalid id',
        });
    }
    try {
        const response = await prismaClient.assistant.deleteMany({
            where: {
                openApiKeyId: Number(openApiKeyId)
            }
        })
        return {
            statusCode: 200,
            statusMessage: 'assistants deleted successfully',
            data: response
        }
    } catch (error) {
        throw createError({
            statusCode: 500,
            statusMessage: JSON.stringify(error)
        });
    }
})
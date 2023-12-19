import { prismaClient } from '../utils/prisma';

export default defineEventHandler(async (event) => {
    if(event.context.error) {
        throw createError(event.context.error);
    }

    const { id } = getQuery(event)

    if(isNaN(Number(id))) {
        throw createError({
            statusCode: 500,
            statusMessage: 'invalid id',
        });
    }
    try {
        const response = await prismaClient.voiceKey.delete({
            where: {
                id: Number(id)
            }
        })
        return {
            statusCode: 200,
            statusMessage: 'api deleted successfully',
            data: response
        }
    } catch (error) {
        throw createError({
            statusCode: 500,
            statusMessage: JSON.stringify(error)
        });
    }
})
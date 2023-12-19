import { prismaClient } from '../utils/prisma'

export default defineEventHandler(async (event) => {
    if (event.context.error) {
        throw createError(event.context.error)
    }
    const { cardId } = getQuery(event)

    // Ensure cardId is provided and is a valid number
    if (!cardId || isNaN(Number(cardId))) {
        throw createError({
            statusCode: 404,
            statusMessage: 'Invalid card ID',
        })
    }

    try {
        // Delete the card from the database
        await prismaClient.card.delete({
            where: { id: Number(cardId) }
        });

        return {
            statusCode: 200,
            statusMessage: 'Card successfully deleted'
        };
    } catch (error) {
        console.error("Error deleting card:", error);
        throw createError({
            statusCode: 500,
            statusMessage: 'Error deleting card',
        })
    }
});

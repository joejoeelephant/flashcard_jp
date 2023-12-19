// card.put.ts
import { prismaClient } from '../utils/prisma';

export const getCard = async (id: number) => {
    try {
        // Use prismaClient to update the card
        const card = await prismaClient.card.findUnique({
            where: { id },
        });

        return {
            statusCode: 200,
            statusMessage: 'success',
            body: card,
        };
    } catch (error) {
        console.error("Error getting card:", error);
        let errorMessage = 'Error getting card.';
        
        throw createError({
            statusCode: 500,
            statusMessage: errorMessage,
        });
    }
};

export default defineEventHandler(async (event) => {
    if (event.context.error) {
        throw createError(event.context.error);
    }

    // Extract the card's id and data from the request body
    const { id} = await readBody(event);
    if (!id) {
        throw createError({
            statusCode: 400,
            statusMessage: 'Card ID is required for updating.',
        });
    }

    return await getCard(id);
});
// card.put.ts
import { prismaClient } from '../utils/prisma';

export const getDeck = async (id: number) => {
    try {
        // Use prismaClient to update the card
        const deck = await prismaClient.deck.findUnique({
            where: { id },
        });

        return {
            statusCode: 200,
            statusMessage: 'success',
            body: deck,
        };
    } catch (error) {
        console.error("Error getting deck:", error);
        let errorMessage = 'Error getting deck.';
        
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
    const {id} = await getQuery(event);;
    if (!id) {
        throw createError({
            statusCode: 400,
            statusMessage: 'Card ID is required for updating.',
        });
    }

    return await getDeck(Number(id));
});
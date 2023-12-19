// card.put.ts
import { prismaClient } from '../utils/prisma';

export const updateCard = async (id: number, cardData: object) => {
    try {
        // Use prismaClient to update the card
        const updatedCard = await prismaClient.card.update({
            where: {
                id: id,
            },
            data: cardData,
        });

        return {
            statusCode: 200,
            statusMessage: 'Card updated successfully',
            body: updatedCard,
        };
    } catch (error) {
        console.error("Error updating card:", error);
        let errorMessage = 'Error updating card.';
        
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
    const { id, cardData } = await readBody(event);
    if (!id) {
        throw createError({
            statusCode: 400,
            statusMessage: 'Card ID is required for updating.',
        });
    }

    return await updateCard(id, cardData);
});

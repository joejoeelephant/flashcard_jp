import { prismaClient } from '../utils/prisma';

function validateCardData(data: any): void {
    if (!data.front || !data.frontCharacter || !data.frontPronunciation) {
        throw createError({
            statusCode: 400,
            statusMessage: 'Front details of the card are required.'
        });
    }

    if (!data.back) {
        throw createError({
            statusCode: 400,
            statusMessage: 'Back of the card is required.'
        });
    }
    
    if(!data.deckId) {
        throw createError({
            statusCode: 400,
            statusMessage: 'deckId of the card is required.'
        });
    }
    // Extend this for other validations as necessary.
}

const prepareCardForInsertion = (cardData: any) => {
    const defaultValues = {
        easeFactor: 2.5,
        interval: 1,
        nextReview: new Date(Date.now() + 24 * 60 * 60 * 1000),
        correctStreak: 0
    };

    return prismaClient.card.create({
        data: {...cardData, ...defaultValues},
    });
}

export const addCards = async (cardsData: any[]) => {
    try {
        const prismaPromises = [];

        for (const cardData of cardsData) {
            validateCardData(cardData); // validate each card data
            prismaPromises.push(prepareCardForInsertion(cardData));
        }

        const results = await prismaClient.$transaction(prismaPromises); // Execute all card insertions in a transaction

        return {
            statusCode: 200,
            statusMessage: 'Cards added successfully',
            data: results
        };
    } catch (error: any) {
        console.error("Error creating cards:", error);

        // More specific error handling can be added here
        throw createError({
            statusCode: error.statusCode || 500,
            statusMessage: error.statusMessage || 'Error adding cards.',
        });
    }
}

export default defineEventHandler(async (event) => {
    if(event.context.error) {
        throw createError(event.context.error);
    }

    const {cardsData} = await readBody(event);

    // Validate if cardsData is an array
    if (!Array.isArray(cardsData)) {
        throw createError({
            statusCode: 400,
            statusMessage: 'cardsData should be an array.',
        });
    }

    return await addCards(cardsData);
});

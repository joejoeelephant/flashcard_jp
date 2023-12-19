import { prismaClient } from '../utils/prisma';


function validateCardData(data: any): void {
    if (!data.front) {
        throw createError({
            statusCode: 400,
            statusMessage: 'Front of the card is required.'
        });
    }

    if (!data.back) {
        throw createError({
            statusCode: 400,
            statusMessage: 'Back of the card is required.'
        });
    }
    // Extend this for other validations as necessary.
}

export const addCard = async (cardData: any) => {
    try {

        const defaultValues = {
            easeFactor: 2.5, // Typical default
            interval: 1,     // Start with 1 day
            nextReview: new Date(Date.now() + 24 * 60 * 60 * 1000), // Tomorrow
            correctStreak: 0
        };

        const card = await prismaClient.card.create({
            data: {...cardData, ...defaultValues},
        });

        

        console.log("Card created:", card);

        return {
            statusCode: 200,
            statusMessage: 'Success',
        };
    } catch (error) {
        console.error("Error creating card:", error);

        throw createError({
            statusCode: 500,
            statusMessage: 'Error creating card.',
        });
    }
}

export default defineEventHandler(async (event) => {
    if(event.context.error) {
        throw createError(event.context.error);
    }

    const {cardData} = await readBody(event);
    console.log(cardData)
    // Validate card data
    validateCardData(cardData);
    return await addCard(cardData)
});

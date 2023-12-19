import { prismaClient } from '../utils/prisma';

export default defineEventHandler(async (event) => {
    if (event.context.error) {
        throw createError(event.context.error);
    }
    const { deckId } = getQuery(event);
    const LIMIT = 10
    try {
        // 1. Get Due Cards
        let cards = await prismaClient.card.findMany({
            where: {
                deckId: Number(deckId),
                OR: [
                    {
                        nextReview: {
                            lte: new Date(), // less than or equal to today
                        },
                    },
                    {
                        lastReviewed: null, // never reviewed cards
                    },
                ],
            },
            orderBy: {
                nextReview: 'asc', // Older review dates come first
            },
            take: LIMIT, // Limit to LIMIT cards
        });

        // 2. If due cards are less than LIMIT, get new cards
        const dueCardCount = cards.length;
        if (dueCardCount < LIMIT) {
            const newCards = await prismaClient.card.findMany({
                where: {
                    deckId: Number(deckId),
                    lastReviewed: null, // fetch cards that haven't been reviewed
                },
                take: LIMIT - dueCardCount, // Fetch the difference
            });

            // //for dev
            // const demoCards = await prismaClient.card.findMany({
            //     where: {
            //         deckId: Number(deckId),
            //     },
            //     take: LIMIT - dueCardCount, // Fetch the difference
            // });

            cards = [...cards, ...newCards];
        }

        return {
            statusCode: 200,
            statusMessage: 'Success',
            body: { cards },
        };
    } catch (error) {
        console.error("Error retrieving cards:", error);
        throw createError({
            statusCode: 500,
            statusMessage: 'Error retrieving cards',
        });
    }
});

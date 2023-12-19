import { prismaClient } from '../utils/prisma';

export default defineEventHandler(async (event) => {
    if (event.context.error) {
        throw createError(event.context.error);
    }
    const { deckId } = getQuery(event);

    try {
        // Fetch New cards
        const newCards = await prismaClient.card.count({
            where: {
                deckId: Number(deckId),
                lastReviewed: null
            }
        });

        // Fetch Learning cards
        const learningCards = await prismaClient.card.count({
            where: {
                deckId: Number(deckId),
                lastReviewed: {
                    not: null
                },
                interval: {
                    lt: 7 // Assuming 7 days as the threshold for learning
                }
            }
        });

        // Fetch Reviewing cards
        const reviewingCards = await prismaClient.card.count({
            where: {
                deckId: Number(deckId),
                interval: {
                    gte: 7 // Assuming cards with intervals of 7 days or more are in the reviewing phase
                }
            }
        });

        //Fetch words number studied today
        const todayStart = new Date();
        todayStart.setHours(0, 0, 0, 0);
        
        const todayEnd = new Date();
        todayEnd.setHours(23, 59, 59, 999);

        const cardsStudiedToday = await prismaClient.card.count({
            where: {
              deckId: Number(deckId),
              lastReviewed: {
                gte: todayStart,
                lte: todayEnd,
              },
            },
          });

        return {
            statusCode: 200,
            statusMessage: 'Success',
            body: {
                newCards,
                learningCards,
                reviewingCards,
                cardsStudiedToday
            },
        };
    } catch (error) {
        console.error("Error retrieving cards:", error);
        throw createError({
            statusCode: 500,
            statusMessage: 'Error retrieving cards',
        });
    }
});

import {prismaClient} from '../utils/prisma'

export default defineEventHandler(async (event) => {
    if(event.context.error) {
        throw createError(event.context.error)
    }

    try {
        // Create a new deck in the database
        const decks = await prismaClient.deck.findMany({
            // Add fields or conditions if needed. For instance:
            // where: { someCondition: value },
            // select: { id: true, name: true } // if you want to select specific fields
        });
    
        return {
            statusCode: 200,
            statusMessage: 'Success',
            body: decks
        };
    } catch (error) {
        console.error("Error retrieving decks:", error);
        throw createError({
            statusCode: 500,
            statusMessage: 'Error retrieving decks',
        })
    }
})
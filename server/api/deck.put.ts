import { prismaClient } from '../utils/prisma';

const updateDeckContent = async (id: number, name: string, description: string) => {
    // Check if the ID is provided
    if (!id) {
        throw createError({
            statusCode: 400,
            statusMessage: 'Deck ID is required for update',
        });
    }

    // Check if the name is provided
    if (!name) {
        throw createError({
            statusCode: 400,
            statusMessage: 'Name is required for update',
        });
    }

    return await updateDeck(id, {name, description})

    
}

const updateDeckLastViewed = async (id: number) => {
    // Check if the ID is provided
    if (!id) {
        throw createError({
            statusCode: 400,
            statusMessage: 'Deck ID is required for update',
        });
    }

    return await updateDeck(id, {lastReviewed: new Date()})

    
}

const updateDeck = async (id: number, deckData: any) => {
    try {
        // Update a deck in the database based on its ID
        const updatedDeck = await prismaClient.deck.update({
            where: { id: Number(id) }, // Convert to Number in case it's a string
            data: deckData
        });


        // Return a success response
        return {
            statusCode: 200,
            statusMessage: 'Deck successfully updated',
            body: updatedDeck
        };
    } catch (error) {
        console.log(error)
        throw createError({
            statusCode: 500,
            statusMessage: 'Failed to update deck',
        });
    }
}

export default defineEventHandler(async (event) => {
    if(event.context.error) {
        throw createError(event.context.error);
    }

    // Get the request body
    const { id, action, payload } = await readBody(event);
    
    if(action === 'updateContent') {
        const {name, description} = payload
        return await updateDeckContent(Number(id), name, description);
    }else if(action === 'updateLastReviewed') {
        updateDeckLastViewed(Number(id))
    }
    else {
        throw createError({
            statusCode: 500,
            statusMessage: 'invalid action',
        });
    }

    
});

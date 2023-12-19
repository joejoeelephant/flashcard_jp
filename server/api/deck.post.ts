import {prismaClient} from '../utils/prisma'

export default defineEventHandler(async (event) => {
    if(event.context.error) {
        throw createError(event.context.error)
    }
    const { name, description } = await readBody(event)

    if (!name) {
        throw createError({
            statusCode: 400,
            statusMessage: 'Name is required'
        })
    }

    try {
        // Create a new deck in the database
        const deck = await prismaClient.deck.create({
            data: {
                name,
                description
            },
        });
    
        console.log("deck created:", deck);
    
        // Return a success response
        return {
            statusCode: 200,
            statusMessage: 'Success',
            body: deck
        }
    } catch (error) {
        throw createError({
            statusCode: 500,
            statusMessage: 'create deck error',
        })
    }
})
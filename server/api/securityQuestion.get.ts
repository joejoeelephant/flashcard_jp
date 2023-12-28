import { prismaClient } from '../utils/prisma';

export default defineEventHandler(async (event) => {
    
    // Extract the card's id and data from the request body
    try {
        // Use prismaClient to update the card
        const response = await prismaClient.user.findFirst({
            select: {
                securityQuestion: true
            }
        });

        return {
            statusCode: 200,
            statusMessage: 'successfully',
            body: response,
        };
    } catch (error) {
        throw createError({
            statusCode: 500,
            statusMessage: JSON.stringify(error)
        });
    }
});

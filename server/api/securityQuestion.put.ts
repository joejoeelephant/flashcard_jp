import { prismaClient } from '../utils/prisma';
import bcrypt from 'bcrypt'

export default defineEventHandler(async (event) => {
    if (event.context.error) {
        throw createError(event.context.error);
    }
    // Extract the card's id and data from the request body
    try {
        const { securityQuestion, securityAnswer } = await readBody(event);

        if(!securityQuestion || !securityAnswer) {
            throw 'securityQuestion || securityAnswer undefined'
        }

        const hashedSecurityAnswer = await bcrypt.hash(securityAnswer, 10);

        // Use prismaClient to update the card
        const updatedUser = await prismaClient.user.update({
            where: {
                id: 1,
            },
            data: {
                securityQuestion,
                securityAnswer: hashedSecurityAnswer
            }
        });

        return {
            statusCode: 200,
            statusMessage: 'securityQuestion updated successfully',
            body: updatedUser,
        };
    } catch (error) {
        throw createError({
            statusCode: 500,
            statusMessage: JSON.stringify(error)
        });
    }
});

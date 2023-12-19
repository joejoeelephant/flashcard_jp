// card.put.ts
import { prismaClient } from '../utils/prisma';

function maskString(str: string) {
    if (str.length <= 8) {
      return str; // Return the original string if it's too short
    }
  
    const firstFour = str.substring(0, 8);
    const lastFour = str.substring(str.length - 4);
    const maskedSection = '*'.repeat(str.length - 8);
  
    return firstFour + maskedSection + lastFour;
}

export default defineEventHandler(async (event) => {
    if (event.context.error) {
        throw createError(event.context.error);
    }

    try {
        const response = await prismaClient.voiceKey.findFirst()
        
        return {
            statusCode: 200,
            statusMessage: 'success',
            body: response
        }
    } catch (error) {
        throw createError({
            statusCode: 500,
            statusMessage: JSON.stringify(error)
        });
    }
});
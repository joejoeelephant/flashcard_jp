import {prismaClient} from '../utils/prisma'

export default defineEventHandler(async (event) => {
    if(event.context.error) {
        throw createError(event.context.error);
    }
    // const { email, password } = await readBody(event)
    const { verbId } = getQuery(event)
    
    try {
        if(isNaN(Number(verbId))) {
            throw "verbId invalid"
        }
        const response1 = await prismaClient.conjugation.deleteMany({
            where: { verbId: Number(verbId) }
        });
      
        // Then, delete the Verb
        const response2 = await prismaClient.verb.delete({
            where: { id: Number(verbId) }
        });

        return {
            statusCode: 200,
            statusMessage: 'Success',
            response: response2
        }
    } catch (error) {
        throw createError({
            statusCode: 500,
            statusMessage: JSON.stringify(error),
        });
    }
})
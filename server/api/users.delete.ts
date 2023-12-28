import {prismaClient} from '../utils/prisma'

export default defineEventHandler(async (event) => {
    
    try {
        const response = await prismaClient.user.deleteMany()

        return {
            statusCode: 200,
            statusMessage: 'Success',
            body: response
        }
    } catch (error) {
        throw createError({
            statusCode: 500,
            statusMessage: JSON.stringify(error),
        });
    }
})
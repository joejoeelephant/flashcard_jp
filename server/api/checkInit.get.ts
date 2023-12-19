import { prismaClient } from '../utils/prisma';

const checkUserExist = async () => {
    try {
        const user = await prismaClient.user.findFirst()
        if(user) {
            return 'user exist'
        }else {
            throw 'user not exist'
        }
    } catch (error) {
        throw JSON.stringify(error)
    }
}
export default defineEventHandler(async (event) => {
    try {
        const response = await checkUserExist()
        return {
            statusCode: 200,
            statusMessage: JSON.stringify(response),
        }
    } catch (error) {
        throw createError({
            statusCode: 500,
            statusMessage: JSON.stringify(error)
        });
    }
});
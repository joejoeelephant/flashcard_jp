import { prismaClient } from '../utils/prisma';

export default defineEventHandler(async (event) => {
    if(event.context.error) {
        throw createError(event.context.error);
    }

    try {
        const {voiceKey} = await readBody(event)
        if(!voiceKey) {
            throw ('voiceKey undefined')
        }
        const response = await prismaClient.voiceKey.create({
            data: {
                value: voiceKey
            }
        })
        return {
            statusCode: 200,
            statusMessage: 'success',
            body: response
        }
    } catch (error) {
        throw createError({
            statusCode: 400,
            statusMessage: JSON.stringify(error),
        });
    }
});

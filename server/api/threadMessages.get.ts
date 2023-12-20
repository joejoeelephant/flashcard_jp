import {prismaClient} from '../utils/prisma'

const getThreadIdByDeckId = async (deckId: number) => {
    try {
        const thread = await prismaClient.thread.findFirst({
            where: {
              deckId: deckId
            },
        });
        return thread?.thread_id
    } catch (error) {
        throw createError({
            statusCode: 500,
            statusMessage: JSON.stringify(error),
        });
    }
}

export default defineEventHandler(async (event) => {
    if(event.context.error) {
        throw createError(event.context.error);
    }
    // const { email, password } = await readBody(event)
    const { deckId } = getQuery(event)
    if(!deckId) {
        throw createError({
            statusCode: 500,
            statusMessage: 'deckId_id invalid'
        });
    }
    try {
        const thread_id = await getThreadIdByDeckId(Number(deckId))
        if(!thread_id) {
            return {
                statusCode: 200,
                statusMessage: 'Success',
                body: {
                    messages: []
                }
            }
        }
        const messages = await prismaClient.threadMessage.findMany({
            where: {
                threadId: thread_id
            }
        })

        return {
            statusCode: 200,
            statusMessage: 'Success',
            body: {
                messages
            }
        }
    } catch (error) {
        throw createError({
            statusCode: 500,
            statusMessage: JSON.stringify(error),
        });
    }
})
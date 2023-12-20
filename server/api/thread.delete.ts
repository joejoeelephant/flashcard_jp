import {prismaClient} from '../utils/prisma'
import {getOpenAIClient} from '../utils/openAIClient'

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
            throw createError({
                statusCode: 500,
                statusMessage: 'thread_id is null'
            });
        }
        console.log(thread_id)
        const OpenAIClient = await getOpenAIClient()
        const openai_response = await OpenAIClient.beta.threads.del(String(thread_id));
        const db_messages_response = await prismaClient.threadMessage.deleteMany({
            where: {
                threadId: String(thread_id)
            }
        })
        const db_thread_response = await prismaClient.thread.deleteMany({
            where: {
                thread_id: String(thread_id)
            }
        })
        

        return {
            statusCode: 200,
            statusMessage: 'Success',
            body: {
                openai_response,
                db_thread_response,
                db_messages_response
            }
        }
    } catch (error) {
        throw createError({
            statusCode: 500,
            statusMessage: JSON.stringify(error),
        });
    }
})
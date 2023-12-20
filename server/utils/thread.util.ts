import {prismaClient} from './prisma'
import {getOpenAIClient} from './openAIClient'

export const getThreadIdByDeckId = async (deckId: number) => {
    try {
        const thread = await prismaClient.thread.findFirst({
            where: {
              deckId: deckId
            },
        });
        return thread?.thread_id
    } catch (error) {
        throw JSON.stringify(error)
    }
}

export const createThreadByDeckId = async (deckId: number) => {
    try {
        const OpenAIClient = await getOpenAIClient()
        const thread =  await OpenAIClient.beta.threads.create();
        const response = await prismaClient.thread.create({
            data: {
                deckId: deckId,
                thread_id: thread.id
            },
        });
        return thread
    } catch (error) {
        throw JSON.stringify(error)
    }
}
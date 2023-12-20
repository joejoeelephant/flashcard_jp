import {prismaClient} from './prisma'
import {getOpenAIClient} from './openAIClient'

export async function getMessagesByThreadId(threadId: string) {
    try {
        const threadMessage = await prismaClient.threadMessage.findFirst({
            where: { threadId }
        });
        return threadMessage;
    } catch (error) {
        throw createError({
            statusCode: 500,
            statusMessage: JSON.stringify(error),
        });
    }
}

export async function saveThreadMesages(threadId: string, messages: any) {
    try {
        await prismaClient.threadMessage.create({
            data: {
                threadId,
                value: JSON.stringify(messages)
            }
        });
    } catch (error) {
        throw JSON.stringify(error)
    }
}

export const createThreadMessages = async (thread_id: string, content: string) => {
    try {
        const OpenAIClient = await getOpenAIClient()
        const message = await OpenAIClient.beta.threads.messages.create(
            thread_id,
            {
              role: "user",
              content: content
            }
        );
        return message
    } catch (error) {
        console.log(error)
        throw JSON.stringify(error)
    }
}

export async function updateMessages(threadId: string, messages: any) {
    try {
        await prismaClient.threadMessage.updateMany({
            where: { threadId },
            data: { value: JSON.stringify(messages) }
        });
    } catch (error) {
        throw JSON.stringify(error)
    }
}
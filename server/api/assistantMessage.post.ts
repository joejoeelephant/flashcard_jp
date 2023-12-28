import {prismaClient} from '../utils/prisma'
import {getOpenAIClient} from '../utils/openAIClient'

import { getAssistantId } from '../utils/assistant.util'
import {getThreadIdByDeckId, createThreadByDeckId} from '../utils/thread.util'
import { getMessagesByThreadId, updateMessages, createThreadMessages } from '../utils/threadMessage.util';


async function handleDatabaseOperations(threadId: string, messages: any) {
    const existingThreadMessage = await getMessagesByThreadId(threadId);
    if (existingThreadMessage) {
        await updateMessages(threadId, messages);
    } else {
        await saveThreadMesages(threadId, messages);
    }
}

const initThread = async (deckId: number) => {
    try {
        const thread_id = await getThreadIdByDeckId(deckId)
        if (!thread_id) {
            const thread = await createThreadByDeckId(deckId)
            return thread.id
        }
        return thread_id
    } catch (error) {
        throw JSON.stringify(error)
    }
}

const executeThread = async (assistant_id: string, thread_id: string) => {
    try {
        const OpenAIClient = await getOpenAIClient()
        if(!OpenAIClient) {
            throw 'OpenClient undefined'
        }
        const run = await OpenAIClient.beta.threads.runs.create(thread_id, {
            assistant_id
        });
        while (true) {
            const runState = await OpenAIClient.beta.threads.runs.retrieve(thread_id, run.id);
            if (runState.status === 'completed') {
                break;
            }
        }
    
        return await OpenAIClient.beta.threads.messages.list(thread_id);
    } catch (error) {
        throw JSON.stringify(error)
    }
}


export default defineEventHandler(async (event) => {
    if(event.context.error) {
        throw createError(event.context.error);
    }
    try {
        const {deckId, message} = await readBody(event)
        const assistantId = await getAssistantId()
        const threadId = await initThread(Number(deckId))
        await createThreadMessages(threadId, message)
        const messages = await executeThread(assistantId, threadId)
        await handleDatabaseOperations(threadId, messages.data)
        return {
            statusCode: 200,
            statusMessage: 'Success',
            body: {
                messages: messages.data
            }
        }
    } catch (error) {
        throw createError({
            statusCode: 500,
            statusMessage: JSON.stringify(error),
        });
    }
});

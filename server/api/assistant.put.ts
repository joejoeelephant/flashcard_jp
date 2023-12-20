import { prismaClient } from '../utils/prisma';
import { getOpenAIClient } from '../utils/openAIClient';
export default defineEventHandler(async (event) => {
    if (event.context.error) {
        throw createError(event.context.error);
    }
    try {
        const { id, assistantId, model } = await readBody(event);
        if(isNaN(Number(id)) || !assistantId || !model) {
            throw 'parameter invalid'
        }
        const OpenAIClient = await getOpenAIClient()
        await OpenAIClient.beta.assistants.update(
            assistantId,
            {
                model
            }
        )
        const updatedAssistant = await OpenAIClient.beta.assistants.retrieve(
            assistantId
        );

        const assistantDB = await prismaClient.assistant.update({
            where: {id},
            data: {
                model
            }
        })
        return {
            statusCode: 200,
            statusMessage: 'Card updated successfully',
            body: {updatedAssistant, assistantDB}
        }
    } catch (error) {
        throw createError({
            statusCode: 500,
            statusMessage: JSON.stringify(error)
        });
    }
    
});

import {openAIClient} from '../utils/openAIClient'

export default defineEventHandler(async (event) => {
    if (event.context.error) {
        throw createError(event.context.error);
    }

    try {
        const OpenAIClient  = await openAIClient
        const list = await OpenAIClient.models.list();
        const response = list.data.filter(item => {
            return (item.id === 'gpt-4' || item.id === 'gpt-3.5-turbo')
        })
        return {
            statusCode: 200,
            statusMessage: 'Success',
            body:response
        }
    } catch (error) {
        throw createError({
            statusCode: 500,
            statusMessage: 'Error retrieving models',
        })
    }
    
});

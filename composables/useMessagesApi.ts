import { CardData, GeneralResponse, ErrorResponse } from '~/types/types'

export function useMessagesApi() {
    const messages = ref<any[]>([])

    function formatExampleText(inputString: string) {
        const sections = inputString.split('\n\n');
        return sections.map(section => {
            const parts = section.split('\n');
            return parts.join('<br />');
        }).join('<br /><br />');
    }

    const getMessages = async (deckId: string) => {
        const { data, error } = await useFetch<GeneralResponse<any>, ErrorResponse>('/api/threadMessages', {
            method: 'get',
            query: { deckId }
        })
        if (data.value?.body?.messages?.length) {
            const messagesValue = JSON.parse(data.value.body.messages[0].value)
            messages.value = messagesValue.reverse().map((item: any) => {
                return formatExampleText(item.content[0].text.value)
            })
        }
        
        return { data, error }
    }

    const sendMessage = async (deckId: string, content: string) => {
        const {data, error} = await useFetch<GeneralResponse<any>, ErrorResponse>('/api/assistantMessage', {
            method: 'post',
            body: { deckId, message: content }
        })
        if (data.value?.body?.messages?.length) {
            const messagesValue = data.value.body.messages
            messages.value = messagesValue.reverse().map((item: any) => {
                return formatExampleText(item.content[0].text.value)
            })
        }
        
        return { data, error }
    }

    const deleteThread = async (deckId: string) => {
        return await useFetch<GeneralResponse<any>, ErrorResponse>('/api/thread', {
            method: 'delete',
            query: { deckId }
        })
    }

    return { messages, getMessages, sendMessage, deleteThread }
}

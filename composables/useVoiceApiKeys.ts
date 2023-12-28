import { GeneralResponse, ErrorResponse } from '~/types/types'

export function useVoiceApiKeys() {
    const apiKeys = ref<any[]>([])

    const fetchApiKeys = async () => {
        const { data, error } = await useFetch<any, any>('/api/voiceKey', { method: 'get' })
        if (data.value.body) {
            apiKeys.value = [data.value.body]
        }
        return { data, error }
    }

    const createApiKey = async (key: string) => {
        const { data, error } = await useFetch<any, any>('/api/voiceKey', {
            method: 'post',
            body: { voiceKey: key }
        })

        if (data.value && data.value.body) {
            apiKeys.value = [data.value.body]
        }

        if (error.value) {
            ElNotification({
                title: 'error',
                message: String(error.value),
                type: 'warning',
            })
        }
        return { data, error }
    }

    const deleteApiKey = async (id: number) => {
        const { data, error } = await useFetch('/api/voiceKey', {
            method: 'delete',
            query: { id }
        })
        if (data.value) {
            apiKeys.value = []
        }
        return { data, error }
    }

    return { apiKeys, fetchApiKeys, createApiKey, deleteApiKey }
}

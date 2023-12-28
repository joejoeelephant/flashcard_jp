import { GeneralResponse, ErrorResponse } from '~/types/types'

export function useOpenApi() {
    const getApiKey = async () => {
        return await useFetch<GeneralResponse<any>, ErrorResponse>('/api/apiKey', {method: 'get'})
    }

    const createApiKey = async (apiKey: string) => {
        return await useFetch<GeneralResponse<any>, ErrorResponse>('/api/apiKey', {
            method: 'post',
            body: {
                apiKey: apiKey
            }
        })
    }

    const deleteApiKey = async (id: number) => {
        return await useFetch<GeneralResponse<any>, ErrorResponse>('/api/apiKey', {
            method: "delete",
            query: {
                id
            }
        })
    }

    const createAssistant = async () => {
        return await useFetch<GeneralResponse<any>, ErrorResponse>('/api/assistant', {
            method: 'post'
        })
    }

    const deleteAsistants = async (openApiKeyId: number) => {
        return await useFetch<GeneralResponse<any>, ErrorResponse>('/api/assistants', {
            method: "delete",
            query: {
                openApiKeyId
            }
        })
    }

    const getAssistant = async () => {
        return await useFetch<GeneralResponse<any>, ErrorResponse>('/api/assistant', {method: 'get'})
    }

    const getAssistantModels = async () => {
        return await useFetch<any, any>('/api/openModels',{method: 'get'})
    }

    const updateAssistantModel = async (id: number, assistantId: string, model: string) => {
        return await useFetch<any, any>('/api/assistant', {
            method: 'put',
            body: {
                id,
                assistantId,
                model
            }
        })
    }

    return {getApiKey, createApiKey, deleteApiKey, createAssistant, getAssistant, deleteAsistants, getAssistantModels, updateAssistantModel}
}
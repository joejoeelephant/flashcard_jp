import { Verb, GeneralResponse, ErrorResponse } from '~/types/types'

export function useVerbApi() {
    const createVerb = async (deckId: number, verb: string) => {
        return await useFetch<GeneralResponse<any>, ErrorResponse>('/api/assistantVerb', {
            method: 'post',
            body: {
                deckId,
                verb
            }
        })
    }

    const deleteItem = async (verbId: number) => {
        return await useFetch<GeneralResponse<any>, ErrorResponse>('/api/verb', {
            method: 'delete',
            query: { verbId }
        })
    }

    return  {createVerb, deleteItem}
}
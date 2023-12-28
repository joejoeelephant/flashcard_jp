import { Deck, GeneralResponse, ErrorResponse } from '~/types/types'

export function useDeckApi() {
    const createDeck = async (name: string, description: string) => {
        return await useFetch<GeneralResponse<Deck>, ErrorResponse>('/api/deck', {
            method: 'post',
            body: {
                name,
                description
            }
        })
    }

    const updateDeck = async (id: number,name: string, description: string ) => {
        return await useFetch<GeneralResponse<any>, ErrorResponse>('/api/deck', {
            method: 'put',
            body: {
                id,
                action: 'updateContent',
                payload: {
                    name,
                    description
                }
            }
        })
    }
    return {createDeck, updateDeck}
}
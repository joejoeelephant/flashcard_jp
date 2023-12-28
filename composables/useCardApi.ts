import { CardData, GeneralResponse, ErrorResponse } from '~/types/types'

export function useCardApi() {
    const createCard = async (cardData: any) => {
        return await useFetch<GeneralResponse<any>,ErrorResponse>('/api/card', { method: 'post', body: { cardData } })
    }

    const deleteCard = async (cardId: number) => {
        return await useFetch<GeneralResponse<any>, ErrorResponse>("/api/card", {
            method: 'delete',
            query: { cardId }
        })
    }

    const updateCard = async (cardId: number, cardData: any) => {
        console.log(cardData)
        return await useFetch<GeneralResponse<any>, ErrorResponse>('/api/card', {
            method: 'put',
            body: {
                id: cardId,
                cardData: cardData
            }
        })
    }

    return { deleteCard, updateCard, createCard }

}
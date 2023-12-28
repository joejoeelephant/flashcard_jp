import { CardData, GeneralResponse, ErrorResponse } from '~/types/types'

export function useCardsApi() {
    const fetchCards = async (query: Record<string, any>) => {
        return await useFetch<GeneralResponse<{cards: CardData[],totalCards: number}>, ErrorResponse>('/api/cards', {
            method: 'get',
            query
        })
    }

    const deleteCard = async (cardId: number) => {
        return await useFetch<GeneralResponse<any>, ErrorResponse>("/api/card", {
            method: 'delete',
            query: { cardId }
        })
    }

    const showNotification = (title: string, message: string, type: 'success' | 'warning') => {
        ElNotification({ title, message, type })
    }

    return { fetchCards, deleteCard, showNotification }
}
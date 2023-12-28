import { CardData, GeneralResponse, ErrorResponse } from '~/types/types'

export const useDueCardsApi = () => {
    const getCards = async (deckId: string) => {
        console.log(deckId)
        return await useFetch<GeneralResponse<{cards: CardData[]}>, ErrorResponse>('/api/due', {
            method: "get",
            query: { deckId }
        });
    }

    const updateLastReviewed = async (deckId: string) => {
        return await useFetch<GeneralResponse<null>, ErrorResponse>('/api/deck', {
            method: "put",
            body: { id: deckId, action: "updateLastReviewed" }
        });
    }

    const cardAction = async (cardId: number, action: string) => {
        return await useFetch<GeneralResponse<null>, ErrorResponse>('/api/cardAction', {
            method: 'put',
            body: { id: cardId, action }
        });
    }

    return { getCards, updateLastReviewed, cardAction };
}

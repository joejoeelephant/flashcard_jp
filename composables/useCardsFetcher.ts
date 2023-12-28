import { CardData, GeneralResponse, ErrorResponse } from '~/types/types'

export function useCardsFetcher() {
    const cardsList = ref<CardData[]>([])
    const totalCardsCount = ref<number>(0)
    const loading = ref<boolean>(false)

    const fetchCards = async (deckId: string, page: number, pageSize: number) => {
        loading.value = true
        
        const { data, error } = await useFetch<GeneralResponse<{cards: CardData[],totalCards: number}>, ErrorResponse>('/api/cards', {
            method: 'get',
            query: { page, pageSize, deckId }
        })

        loading.value = false
        cardsList.value = data.value?.body.cards || []
        totalCardsCount.value = data.value?.body.totalCards || 0

        if(error.value) {
            console.log(error.value.statusMessage)
        }
    }

    return { cardsList, totalCardsCount, loading, fetchCards }
}
import { GeneralResponse, ErrorResponse, Deck } from '~/types/types'

interface CardsState {
    newCards: number,
    learningCards: number,
    reviewingCards: number,
    cardsStudiedToday: number
}
export function useCardState() {
    const state = ref<CardsState>({
        newCards: 0,
        learningCards: 0,
        reviewingCards: 0,
        cardsStudiedToday: 0
    })

    const fetchCardState = async (deckId: number) => {
        const { data, error } = await useFetch<GeneralResponse<CardsState>, ErrorResponse>('/api/cardStateFetcher', {
            method: "get",
            query: { deckId }
        })

        if (data.value) {
            state.value = data.value.body
        }

        return { data, error }
    }

    return { state, fetchCardState }
}

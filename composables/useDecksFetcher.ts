import { CardData, GeneralResponse, ErrorResponse, Deck } from '~/types/types'

export function useDecksFetcher() {
    const decks = ref<Deck[]>([])
    const loading = ref(false)
    const fetchDecks = async () => {
        loading.value = true
        const { data, error } = await useFetch<GeneralResponse<Deck[]>, ErrorResponse>('/api/decks', { method: "get" })
        loading.value = false
        if (data.value) {
            decks.value = data.value.body
        }

        if(error.value) {
            console.log(error.value.statusMessage)
        }
    }

    const refreshDecks = (newDecks: Deck[]) => {
        decks.value = newDecks
    }

    return { loading, decks, fetchDecks, refreshDecks }
}

import { Verb, GeneralResponse, ErrorResponse } from '~/types/types'

export function useVerbsFetcher() {
    const verbs = ref<any[]>([])
    const loading = ref(false)

    const fetchVerbs = async (deckId: number) => {
        loading.value = true
        const { data, error } = await useFetch<GeneralResponse<Verb[]>, ErrorResponse>('/api/verbs', {
            method: 'get',
            query: { deckId }
        })
        loading.value = false
        if (data.value) {
            verbs.value = data.value.body
        }
        return { data, error }
    }

    return { verbs, loading, fetchVerbs }
}

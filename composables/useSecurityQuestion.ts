import { GeneralResponse, ErrorResponse } from '~/types/types'

export function useSecurityQuestion() {
    const question = ref('')

    const fetchQuestion = async () => {
        const { data, error } = await useFetch<GeneralResponse<any>, ErrorResponse>('/api/securityQuestion', { method: 'get' })
        if (data.value) {
            question.value = data.value.body.securityQuestion
        }
        return { data, error }
    }

    const checkAnswer = async (answer: string) => {
        return await useFetch<GeneralResponse<any>, ErrorResponse>('/api/securityQuestionCheck', {
            method: 'post',
            body: { answer }
        })
    }

    return { question, fetchQuestion, checkAnswer }
}

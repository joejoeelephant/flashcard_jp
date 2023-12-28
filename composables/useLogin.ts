// useLogin.ts
import { ref } from 'vue'
type ResponseType = { statusCode: number; statusMessage: string; user: { id: number; email: string; token: string; } }
export function useLogin() {
    const pending = ref(false);
    const dataResponse = ref<ResponseType| null>(null)
    const errorResponse = ref<any>('')
    
    const requestLogin = async (email: string, password: string) => {
        pending.value = true
        const {data, error} = await useFetch("/api/login", {
            method: 'post',
            body: {email, password}
        })
        pending.value = false
        dataResponse.value = data.value
        errorResponse.value = error.value
    };

    return { requestLogin, pending, dataResponse, errorResponse };
}

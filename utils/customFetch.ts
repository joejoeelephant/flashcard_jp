import { ElNotification } from 'element-plus'

type UseFetchOptions<DataT> = {
  key?: string
  method?: string
  query?: SearchParams
  params?: SearchParams
  body?: RequestInit['body'] | Record<string, any>
  headers?: Record<string, string> | [key: string, value: string][] | Headers
  baseURL?: string
  server?: boolean
  lazy?: boolean
  immediate?: boolean
  getCachedData?: (key: string) => DataT
  deep?: boolean
  dedupe?: 'cancel' | 'defer'
  default?: () => DataT
  transform?: (input: DataT) => DataT
  pick?: string[]
  watch?: WatchSource[] | false
}

type AsyncData<DataT, ErrorT> = {
  data: Ref<DataT | null>
  pending: Ref<boolean>
  refresh: (opts?: AsyncDataExecuteOptions) => Promise<void>
  execute: (opts?: AsyncDataExecuteOptions) => Promise<void>
  error: Ref<ErrorT | null>
  status: Ref<AsyncDataRequestStatus>
}

interface AsyncDataExecuteOptions {
  dedupe?: 'cancel' | 'defer'
}

type AsyncDataRequestStatus = 'idle' | 'pending' | 'success' | 'error'

export async function customFetch<DataT, ErrorT>(
    url: string | Request | Ref<string | Request> | () => string | Request,
    options?: UseFetchOptions<DataT>
  ): Promise<AsyncData<DataT, ErrorT>> {
  const router = useRouter()
  const {data, pending, error} = await useFetch<DataT>(url, options);
  if(error.value?.statusCode == 403) {
    ElNotification({
      title: 'Warning',
      message: error.value?.statusMessage,
      type: 'warning',
    })
    router.push({path: '/login'})
    return {data, error, pending};
  } 
  return {data, error, pending}
}
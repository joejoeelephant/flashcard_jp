import { describe, it, expect, vi, beforeEach } from 'vitest'
import { ref } from 'vue'
import { useLogin } from './useLogin'

// Mock the useFetch composable directly
vi.mock('#app', () => {
  return {
    useFetch: vi.fn()
  }
})

describe('useLogin', () => {
  beforeEach(() => {
    vi.resetAllMocks() // Reset mocks before each test
  })

  it('handles successful login', async () => {
    // Mock useFetch for a successful login
    vi.mocked(useFetch).mockImplementation(() => ({
      data: ref({ statusCode: 200, statusMessage: 'Success', user: { id: 1, email: 'test@example.com', token: 'abc123' }}),
      error: ref(null),
      pending: ref(false),
      refresh: vi.fn(),
      execute: vi.fn(),
      // Mock other properties if they are used in your composable
    }))

    const { requestLogin, pending, dataResponse, errorResponse } = useLogin()

    expect(pending.value).toBe(false)
    await requestLogin('test@example.com', 'password')
    expect(pending.value).toBe(false)
    expect(dataResponse.value).toEqual({
      statusCode: 200,
      statusMessage: 'Success',
      user: { id: 1, email: 'test@example.com', token: 'abc123' }
    })
    expect(errorResponse.value).toBeNull()
  })

  it('handles login failure', async () => {
    // Mock useFetch for a failed login
    vi.mocked(useFetch).mockImplementation(() => ({
      data: ref(null),
      error: ref({ message: 'Invalid credentials' }),
      pending: ref(false),
      refresh: vi.fn(),
      execute: vi.fn(),
      // Mock other properties if they are used in your composable
    }))

    const { requestLogin, pending, dataResponse, errorResponse } = useLogin()

    expect(pending.value).toBe(false)
    await requestLogin('wrong@example.com', 'password')
    expect(pending.value).toBe(false)
    expect(dataResponse.value).toBeNull()
    expect(errorResponse.value).toEqual({ message: 'Invalid credentials' })
  })
})

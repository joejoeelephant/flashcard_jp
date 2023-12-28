// useValidation.spec.ts
import { describe, it, expect, vi } from 'vitest'
import { validateEmail, validatePass, validatePass2 } from './useValidation'

describe('useValidation', () => {
  // Test cases for validateEmail
  describe('validateEmail', () => {
    it('should validate a correct email', () => {
      const callback = vi.fn()
      validateEmail({}, 'test@example.com', callback)
      expect(callback).toHaveBeenCalledWith()
    })

    it('should return error for invalid email', () => {
      const callback = vi.fn()
      validateEmail({}, 'test', callback)
      expect(callback).toHaveBeenCalledWith(new Error('Please input the valid email'))
    })

    it('should return error for empty email', () => {
      const callback = vi.fn()
      validateEmail({}, '', callback)
      expect(callback).toHaveBeenCalledWith(new Error('Please input the email'))
    })
  })

  // Test cases for validatePass
  describe('validatePass', () => {
    it('should validate a non-empty password', () => {
      const callback = vi.fn()
      validatePass({}, 'password', callback)
      expect(callback).toHaveBeenCalledWith()
    })

    it('should return error for empty password', () => {
      const callback = vi.fn()
      validatePass({}, '', callback)
      expect(callback).toHaveBeenCalledWith(new Error('Please input the password'))
    })
  })

  describe('validatePass2', () => {
    const firstPassword = 'password123'
  
    it('should validate when the second password matches the first password', () => {
      const callback = vi.fn()
      validatePass2(firstPassword)({}, firstPassword, callback)
      expect(callback).toHaveBeenCalledWith()
    })
  
    it('should return error when the second password does not match the first password', () => {
      const callback = vi.fn()
      validatePass2(firstPassword)({}, 'differentPassword', callback)
      expect(callback).toHaveBeenCalledWith(new Error('Passwords do not match'))
    })
  
    it('should return error for empty second password', () => {
      const callback = vi.fn()
      validatePass2(firstPassword)({}, '', callback)
      expect(callback).toHaveBeenCalledWith(new Error('Please confirm the password'))
    })
  })
})

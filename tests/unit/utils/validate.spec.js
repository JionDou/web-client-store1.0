import { validUsername, validURL, validLowerCase, validUpperCase, validAlphabets } from '@/utils/validate.js'
describe('Utils:validate', () => {
  it('validUsername', () => {
    expect(validUsername('client')).toBe(true)
    expect(validUsername('mobile')).toBe(true)
    expect(validUsername('xxxx')).toBe(false)
  })
  it('validURL', () => {
    expect(validURL('')).toBe(true)
    expect(validURL('')).toBe(true)
    expect(validURL('')).toBe(false)
  })
  it('validLowerCase', () => {
    expect(validLowerCase('abc')).toBe(true)
    expect(validLowerCase('Abc')).toBe(false)
    expect(validLowerCase('123abc')).toBe(false)
  })
  it('validUpperCase', () => {
    expect(validUpperCase('ABC')).toBe(true)
    expect(validUpperCase('Abc')).toBe(false)
    expect(validUpperCase('123ABC')).toBe(false)
  })
  it('validAlphabets', () => {
    expect(validAlphabets('ABC')).toBe(true)
    expect(validAlphabets('Abc')).toBe(true)
    expect(validAlphabets('123aBC')).toBe(false)
  })
})

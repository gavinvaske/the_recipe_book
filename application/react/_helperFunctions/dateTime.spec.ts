import * as dateTime from './dateTime'
import { expect } from '@jest/globals';

describe('File: dateTime', () => {
  describe('Function: getDayMonthYear', () => {
    it('should return N/A if undefined date is provided', () => {
      const result = dateTime.getDayMonthYear(undefined)

      expect(result).toBe('N/A')
    })

    it('should return the correctly formatted date', () => {
      const date = new Date('January 01 2020')

      const result = dateTime.getDayMonthYear(date)

      expect(result).toBe('January 01, 2020')
    })

    it('should return the correctly formatted date', () => {
      const unixTimestamp = 1721584751
      const date = new Date(unixTimestamp * 1000)

      const result = dateTime.getDayMonthYear(date)

      expect(result).toBe('July 21, 2024')
    })
  })
})
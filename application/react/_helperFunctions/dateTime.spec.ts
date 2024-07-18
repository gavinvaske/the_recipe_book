// import { Chance } from 'chance'
// import * as dateTime from './dateTime'
const Chance = require('chance');
const dateTime = require('./dateTime');

const chance = new Chance();

describe('File: dateTime', () => {
  describe('Function: getDayMonthYear', () => {
    it('should return N/A if undefined date is provided', () => {
      const result = dateTime.getDayMonthYear(undefined)

      expect(result).toBe('N/A')
    })

    it.only('should return the correctly formatted date', () => {
      const date = new Date('January 01 2020')

      const result = dateTime.getDayMonthYear(date)

      expect(result).toBe('January 1st, 2020')
    })
  })

  describe('Function: convertDateStringToFormInputDateString', () => {

  })
})
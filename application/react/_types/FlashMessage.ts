import { Implements } from "./tsHelpers"

interface IFlashMessage {
  message: string,
  uuid: string,
  type: 'SUCCESS' | 'ERROR'
}

export type ErrorFlashMessage = Implements<IFlashMessage, {
  message: string,
  uuid: string,
  type: 'ERROR'
}>

export type SuccessFlashMessage = Implements<IFlashMessage, {
  message: string,
  uuid: string,
  type: 'SUCCESS'
}>

export type FlashMessage = ErrorFlashMessage | SuccessFlashMessage
import { Implements } from "../shared/_utility";

interface IFlashMessage {
  message: string
  uuid: string
  type: 'SUCCESS' | 'ERROR'
}

export type ErrorFlashMessage = Implements<IFlashMessage, {
  message: string
  uuid: string
  type: 'ERROR'
}>

export type SuccessFlashMessage = Implements<IFlashMessage, {
  message: string
  uuid: string
  type: 'SUCCESS'
}>

export type FlashMessageOption = ErrorFlashMessage | SuccessFlashMessage

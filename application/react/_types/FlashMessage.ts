export type ErrorFlashMessage = {
  message: string,
  uuid: string,
  type: 'SUCCESS' | 'ERROR' // TODO (6-6-2024): This isn't right
}

export type SuccessFlashMessage = {
  message: string,
  uuid: string,
  type: 'SUCCESS' | 'ERROR' // TODO (6-6-2024): This isn't right
}

export type FlashMessage = ErrorFlashMessage | SuccessFlashMessage
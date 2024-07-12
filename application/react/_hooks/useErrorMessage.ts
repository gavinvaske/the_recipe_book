import { AxiosError } from "axios";
import flashMessageStore from "../stores/flashMessageStore";

export const useErrorMessage = (error: AxiosError | Error) => {
  if (error instanceof AxiosError) {
    flashMessageStore.addErrorMessage(error.response?.data as string)
  } else if (error instanceof Error) {
    flashMessageStore.addErrorMessage(error.message)
  } else {
    console.error('Unepected error: ', error)
    flashMessageStore.addErrorMessage('A totally unexpected error occurred, check the console for more details')
  }
}
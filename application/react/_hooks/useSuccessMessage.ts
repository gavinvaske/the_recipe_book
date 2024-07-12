import flashMessageStore from "../stores/flashMessageStore";

export const useSuccessMessage = (message: string) => {
  flashMessageStore.addSuccessMessage(message);
}
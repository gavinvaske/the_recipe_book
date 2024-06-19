import { makeAutoObservable } from 'mobx';
import { ErrorFlashMessage, SuccessFlashMessage, FlashMessage } from '../_types/FlashMessage';
import { v4 as uuidv4 } from 'uuid';

/* 
  Questions: How do we want to handle flash messages?
  Should they have a timer, where they're only displayed on the page for X seconds?
*/
class FlashMessageStore {
  errorMessages: ErrorFlashMessage[] = [
    {
      message: 'Error #111',
      uuid: uuidv4(),
      type: 'ERROR'
    },
    {
      message: 'Error #222',
      uuid: uuidv4(),
      type: 'ERROR'
    },
    {
      message: 'Error #333',
      uuid: uuidv4(),
      type: 'ERROR'
    }
  ]
  successMessage: SuccessFlashMessage | null = 
    {
      message: 'Success #111',
      uuid: uuidv4(),
      type: 'SUCCESS'
    }

  constructor() {
    makeAutoObservable(this);
  }

  getFlashMessages() {
    const flashMessages: FlashMessage[] = [...this.errorMessages]

    if (this.successMessage) flashMessages.push(this.successMessage)

    return flashMessages
  }

  removeFlashMessage(uuidToRemove: string) : void {
    let errorIndexToRemove: number = this.errorMessages.findIndex(({ uuid }) => uuid === uuidToRemove);

    if (errorIndexToRemove >= 0) {
      this.errorMessages.splice(errorIndexToRemove, 1) // Removes 1 element from array
      return;
    }

    if (this.successMessage && this.successMessage.uuid === uuidToRemove) {
      this.clearSuccessMessage()
    }
  }

  addErrorMessage(message: string): void {
    const errorMessage: ErrorFlashMessage = {
      message: message || 'Undefined Error Message',
      uuid: uuidv4(),
      type: 'ERROR'
    }

    this.errorMessages = [errorMessage, ...this.errorMessages];
  }

  addSuccessMessage(message: string): void {
    const successMessage: SuccessFlashMessage = {
      message,
      uuid: uuidv4(),
      type: 'SUCCESS'
    }

    this.clearAllMessages();
    
    this.successMessage = successMessage
  }

  clearErrorMessages(): void {
    this.errorMessages = []
  }

  clearSuccessMessage(): void {
    this.successMessage = null
  }

  clearAllMessages(): void {
    this.clearErrorMessages()
    this.clearSuccessMessage()
  } 
}

export default new FlashMessageStore();
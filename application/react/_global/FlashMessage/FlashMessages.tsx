import React from 'react';
import './FlashMessages.scss';
import flashMessageStore from '../../stores/flashMessagesStore';
import { FlashMessage } from '../../_types/FlashMessage';
import { observer } from 'mobx-react-lite';

type FlashMessageProps = {
  flashMessage: FlashMessage
}

const FlashMessage = (props : FlashMessageProps) => {
  const { flashMessage } = props;
  const { message, uuid, type } = flashMessage;

  return (
    <div className={`flash-message ${type === 'SUCCESS' ? 'success-flash-message' : 'error-flash-message'}`}>
      {message}
      <button onClick={() => flashMessageStore.removeFlashMessage(uuid)}>Click to Close</button>
    </div>
  )
}

export const FlashMessages = observer(() => {
  const flashMessages = flashMessageStore.getFlashMessages();
  
  return (
    <div className='flash-message-container'>
      {flashMessages.map((flashMessage) => <FlashMessage flashMessage={flashMessage} key={flashMessage.uuid}/>)}
    </div>


  )
})
import React, { useEffect, useState } from 'react';
import './FlashMessagePanel.scss';
import flashMessageStore from '../../stores/flashMessagesStore';
import { FlashMessage } from '../../_types/FlashMessage';
import { observer } from 'mobx-react-lite';

type FlashMessageProps = {
  flashMessage: FlashMessage
}

const FlashMessage = (props : FlashMessageProps) => {
  const { flashMessage } = props;
  const { message, uuid, type } = flashMessage;
  const [shouldSuccessMessageBeRendered, setShouldSuccessMessageBeRendered] = useState(true);

  useEffect(() => {
    const sevenSecondDelayInMs = 7000;
    setTimeout(() => {
      setShouldSuccessMessageBeRendered(false)  // Success messages are hidden after x-seconds
    }, sevenSecondDelayInMs)
  }, [])

  const shouldRender = (type === 'SUCCESS' && shouldSuccessMessageBeRendered) || (type === 'ERROR')

  return (
    <>
      {shouldRender && (
        <div className={`flash-message ${type === 'SUCCESS' ? 'success-flash-message' : 'error-flash-message'}`}>
          {message}
          <i className='fa-regular fa-close' onClick={() => flashMessageStore.removeFlashMessage(uuid)}></i>
        </div>
      )}
    </>
  )
}

export const FlashMessagePanel = observer(() => {
  const flashMessages = flashMessageStore.getFlashMessages();
  
  return (
    <div className='flash-message-container'>      
      {flashMessages.map((flashMessage) => <FlashMessage flashMessage={flashMessage} key={flashMessage.uuid}/>)}
      {(() => {
        if (flashMessages.length > 1) { // IFF more than one flash message is on the screen, show user a "clear all" button
          return <button onClick={() => flashMessageStore.clearAllMessages()}>Clear All Messages</button>
        }
      })()}
    </div>
  )
})
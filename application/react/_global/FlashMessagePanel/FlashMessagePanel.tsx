import React, { useEffect, useState } from 'react';
import './FlashMessagePanel.scss';
import flashMessageStore from '../../stores/flashMessageStore';
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
  const shouldRenderFlashMessagePanel = flashMessages.length > 0
  const shouldRenderClearAllFlashMessagesButton = flashMessages.length > 1;

  return (
    <>
    {shouldRenderFlashMessagePanel &&
      <div className='flash-message-container'>
        {flashMessages.map((flashMessage) => <FlashMessage flashMessage={flashMessage} key={flashMessage.uuid}/>)}
        {shouldRenderClearAllFlashMessagesButton &&
          <button onClick={() => flashMessageStore.clearAllMessages()}>Clear All Messages</button>
        }
      </div>
    }
    </>
  )
})
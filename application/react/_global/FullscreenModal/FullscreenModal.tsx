import React from 'react';
import './FullScreenModal.scss';

type Props = {
  onClose: () => void,
  children: React.ReactNode
}

export const FullScreenModal = (props: Props) => {
  const { onClose, children } = props;

  const fullScreenModalBackgroundClassName = 'fullscreen-modal-background'

  const closeModalIfBackgroundWasClicked = (e) => {
    const wasBackgroundClicked = e.target.classList.contains(fullScreenModalBackgroundClassName)

    if (wasBackgroundClicked){
      onClose();
    }
  }

  return (
    <div className={`modal ${fullScreenModalBackgroundClassName}`} onClick={(e) => closeModalIfBackgroundWasClicked(e) }>
      <div className='modal-box'>
        <i className='fa-light fa-xmark close-modal' onClick={() => onClose()}></i>
        {children}
      </div>
    </div>
  )
}
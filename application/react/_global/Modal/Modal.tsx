import React from 'react';
import './Modal.scss';

type Props = {
  onClose: () => void,
  children: React.ReactNode
}

export const Modal = (props: Props) => {
  const { onClose, children } = props;
  const modalBackgroundClassName = 'modal-background'

  /* 
    VERY IMPORTANT! Otherwise clicks on this modal bubble up to an unknown number of parents. 
    If this is removed, bad stuff will happen when modals are clicked...
  */
  const onClick = (e) => {
    const wasBackgroundClicked = e.target.classList.contains(modalBackgroundClassName)

    if (wasBackgroundClicked){
      onClose();
    }
    e.stopPropagation();  // VERY IMPORTANT: Prevents this click from bubbling up to parents'
  }

  return (
    <div className={modalBackgroundClassName} onClick={(e) => onClick(e)}>
      <div className='modal-box'>
        <i className='fa-light fa-xmark close-modal' onClick={() => onClose()}></i>
        {children}
      </div>
    </div>
  )
}
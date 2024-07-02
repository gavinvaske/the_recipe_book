import React from 'react';
import './Modal.scss';

type Props = {
  onClose: () => void,
  children: React.ReactNode
}

export const Modal = (props) => {
  const { onClose, children } = props;

  /* 
    VERY IMPORTANT! Otherwise clicks on this modal bubble up to an unknown number of parents. 
    If this is removed, bad stuff will happen when modals are clicked...
  */
  const onClick = (e) => {
    onClose();
    e.stopPropagation();  // VERY IMPORTANT: Prevents this click from bubbling up to parents'
  }

  return (
    <div className='modal-background' onClick={(e) => onClick(e)}>
      <div className='modal-box'>
        <i className="fa-light fa-xmark" onClick={() => onClose()}></i>
        {children}
      </div>
    </div>
  )
}
import React from 'react';
import './FullscreenModal.scss';

type Props = {
  onClose: () => void,
  children: React.ReactNode
}

export const FullscreenModal = (props: Props) => {
  const { onClose, children } = props;

  return (
    <div className='modal fullscreen-modal-background'>
      <div className='modal-box'>
        <i className='fa-light fa-xmark close-modal' onClick={() => onClose()}></i>
        {children}
      </div>
    </div>
  )
}
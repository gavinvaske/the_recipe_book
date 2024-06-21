import React from 'react';
import './FullscreenModal.scss';

type Props = {
  onClose: () => void,
  children: React.ReactNode
}

export const FullscreenModal = (props: Props) => {
  const { onClose, children } = props;
  return (
    <div className='modal material-inventory-modal'>
      <div className='modal-box'>
        <div className='modal-header'>
          <i className='fa-light fa-xmark close-modal' onClick={() => onClose()}></i>
        </div>
        <div className='modal-body'>
          <div className='left-body'>

          </div>
          <div className='right-body'>
            {children}
          </div>
        </div>
      </div>
    </div>
  )
}
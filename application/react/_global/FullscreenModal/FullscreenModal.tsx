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
      <div onClick={() => onClose()}>Click Here to Close</div>
      {children}
    </div>
  )
}
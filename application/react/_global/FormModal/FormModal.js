import React from 'react';
import './FormModal.scss'

export const FormModal = (props) => {
  const {
    Form,
    onCancel,
    onSubmit
  } = props;

  return (
    <div className='modal'>
      <div className='modal-content'>
        <Form 
          onSubmit={onSubmit}
          onCancel={onCancel} 
        />
      </div>
    </div>
  )
}

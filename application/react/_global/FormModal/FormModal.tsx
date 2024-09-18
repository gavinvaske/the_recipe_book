import React from 'react';
import './FormModal.scss'

export const FormModal = (props) => {
  const {
    Form,
    onCancel,
    onSubmit,
    ...additionalProps
  } = props;

  return (
    <div className='modal-wrapper'>
      <div className='modal card'>
      <button className='close-button' type="button" onClick={() => onCancel()}><i className="fa-solid fa-x"></i></button>
        <div className='modal-content'>
          <Form
            onSubmit={onSubmit}
            onCancel={onCancel}
            {...additionalProps}
          />
        </div>
      </div>
    </div>
  )
}

import React from 'react';
import './FormModal.scss'
import { useForm } from 'react-hook-form';

interface Props {
  Form: React.ElementType;
  onCancel: () => void;
  onSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
  [key: string]: any;  // Additional props to pass down to the form component
}

export const FormModal = (props: Props) => {
  const {
    Form,
    onCancel,
    onSubmit,
    ...additionalProps
  } = props;

    const { register, handleSubmit } = useForm<any>();

  return (
    <div className='modal-wrapper'>
      <div className='modal card'>
      <button className='close-button' type="button" onClick={() => onCancel()}><i className="fa-solid fa-x"></i></button>
        <div className='modal-content'>
          <Form
            onSubmit={onSubmit}
            handleSubmit={handleSubmit}
            onCancel={onCancel}
            register={register}
            {...additionalProps}
          />
        </div>
      </div>
    </div>
  )
}

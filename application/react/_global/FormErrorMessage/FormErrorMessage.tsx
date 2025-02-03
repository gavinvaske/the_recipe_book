import React from 'react';
import './FormErrorMessage.scss'

interface Props {
  errors: any,  // TODO: type this
  name: string,
}

const FormErrorMessage = ({ errors, name }: Props) => {
  const errorMessage = name.split('.').reduce((obj, key) => obj && obj[key], errors);

  if (!Object.keys(errors).length || !errorMessage) {
    return null
  }

  return (
    <div className="form-error-message">
      {errorMessage?.message || 'Unknown Error'}

    </div>
  );
}

export default FormErrorMessage;
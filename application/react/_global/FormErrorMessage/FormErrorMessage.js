import React from 'react';
import './FormErrorMessage.scss'

const FormErrorMessage = ({ errors, name }) => {
  if (!errors || !errors[name]) {
    return null
  }
  return (
    <div className="form-error-message">
      {errors[name].message}
    </div>
  );
}

export default FormErrorMessage;
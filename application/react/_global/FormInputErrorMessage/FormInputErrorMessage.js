import React from 'react';
import './FormInputErrorMessage.scss'

const ErrorMessage = ({ errors, name }) => {
  if (errors[name]) {
    return (
      <div className="form-input-error-message">
        {errors[name].message}
      </div>
    );
  }
  return null;
}

export default ErrorMessage;
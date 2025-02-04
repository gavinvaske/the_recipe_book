import React from 'react';
import './FormErrorMessage.scss'
import { FieldErrors, FieldValues } from 'react-hook-form';

interface Props<T extends FieldValues> {
  errors: FieldErrors<T>,
  name: string,
}

const FormErrorMessage = <T extends FieldValues>({ errors, name }: Props<T>) => {
  const errorMessage = name.split('.').reduce((obj, key) => {
    return obj && typeof obj === 'object' ? (obj as Record<string, any>)[key] : undefined;
  }, errors as Record<string, any>);

  const message = typeof errorMessage === 'object' && 'message' in errorMessage
    ? String(errorMessage.message)
    : undefined;

  return (
    <div className="form-error-message">
      {message || 'Uh oh, unknown error'}

    </div>
  );
}

export default FormErrorMessage;
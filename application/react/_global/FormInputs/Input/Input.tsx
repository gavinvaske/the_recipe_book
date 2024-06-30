import React from 'react';
import './Input'
import FormErrorMessage from '../../FormErrorMessage/FormErrorMessage';
import { FieldErrors, FieldValues, Path, UseFormRegister } from 'react-hook-form';

type Props<T extends FieldValues> = {
  attribute: Path<T>
  label: string
  register: UseFormRegister<T>
  errors: FieldErrors,
  placeholder?: string
  defaultValue?: string
  isRequired?: boolean
  additionalRegisterOptions?: any
  onChange?: () => void
}

/* @Gavin More client side validation rules can be configured in react-hook-form. see https://react-hook-form.com/get-started#Applyvalidation */
export const Input = <T extends FieldValues>(props: Props<T>) => {
  const { placeholder, errors, attribute, defaultValue, label, register, isRequired } = props

  return (
    <div className='input-wrapper'>
      <label>{label}<span className='red'>{isRequired ? '*' : ''}</span>:</label>
      <input type="text" 
        placeholder={placeholder}
        value={defaultValue}
        {...register(
          attribute,
          { 
            required: isRequired ? "This is required" : undefined 
          })
        } />
      <FormErrorMessage errors={errors} name={attribute} />
    </div>
  )
}
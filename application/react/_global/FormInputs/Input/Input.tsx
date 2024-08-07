import React, { forwardRef } from 'react';
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
  onChange?: () => void,
  fieldType?: 'text' | 'checkbox' | 'date' | 'password',
  ref?: any
}

/* @Gavin More client side validation rules can be configured in react-hook-form. see https://react-hook-form.com/get-started#Applyvalidation */
export const Input = forwardRef(<T extends FieldValues>(props: Props<T>, customRef: any) => {
  const { placeholder, errors, attribute, defaultValue, label, register, isRequired, fieldType} = props

  const { ref, ...rest } = register(attribute,
    { required: isRequired ? "This is required" : undefined }
  );

  return (
    <div className='input-wrapper'>
      <label>{label}<span className='red'>{isRequired ? '*' : ''}</span>:</label>
      <input 
        {...rest}
        type={fieldType ? fieldType : 'text'}
        placeholder={placeholder}
        value={defaultValue}
        ref={(e) => {   // solution from https://stackoverflow.com/a/71497701
          ref(e)
          if (customRef) {
            customRef.current = e
          }
        }}
        />
      <FormErrorMessage errors={errors} name={attribute} />
    </div>
  )
})
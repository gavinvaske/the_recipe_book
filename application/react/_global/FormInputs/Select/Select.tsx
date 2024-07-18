import React from 'react';
import './Select.scss'
import { FieldErrors, FieldValues, Path, UseFormRegister } from 'react-hook-form';
import FormErrorMessage from '../../FormErrorMessage/FormErrorMessage';

export type SelectOption = {
  displayName: string,
  value: string | number
}

type Props<T extends FieldValues> = {
  attribute: Path<T>,
  options: SelectOption[],
  label: string,
  register: UseFormRegister<T>,
  errors: FieldErrors,
  defaultValue?: string,
  isRequired?: boolean,
  isMultiSelect?: boolean
}

export const Select = <T extends FieldValues>(props: Props<T>) => {
  const { attribute, label, errors, options, isRequired, register, isMultiSelect } = props;

  return (
    <div>
      <label>{label}<span className='red'>{isRequired ? '*' : ''}</span>:</label>

      <select {...register(attribute, {required: isRequired ? "Please select an option" : undefined })} multiple={isMultiSelect ? true : false}>
        <option value="">-- Select --</option>
        {options && options.map((option: SelectOption, index: number) => (<option key={index} value={option.value}>{option.displayName}</option>))}
      </select>

      <FormErrorMessage errors={errors} name={attribute} />
    </div>
  )
}
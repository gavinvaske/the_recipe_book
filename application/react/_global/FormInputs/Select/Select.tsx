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
  defaultValue?: string | string[],
  isRequired?: boolean,
  isMultiSelect?: boolean
}

export const Select = <T extends FieldValues>(props: Props<T>) => {
  const { attribute, label, errors, options, isRequired, register, isMultiSelect, defaultValue } = props;

  if (Array.isArray(props.defaultValue) && !isMultiSelect) throw new Error('Single select cannot have multiple default values')

  options.sort((a, b) => a.displayName?.localeCompare(b.displayName))  /* Sort all dropdowns alphabeticalically (My Best Random Idea ever!) */

  return (
    <div>
      <label>{label}<span className='red'>{isRequired ? '*' : ''}</span>:</label>

      <select {...register(attribute, { required: isRequired ? "Please select an option" : undefined })} multiple={isMultiSelect ? true : false}>
        <option value="">-- Select --</option>
        {options && options.map((option: SelectOption, index: number) => (
          <option
            key={index}
            value={option.value}
            selected={shouldBeSelected(defaultValue, option.value) ? true : false}
          >{option.displayName}</option>
        ))
        }
      </select>

      <FormErrorMessage errors={errors} name={attribute} />
    </div>
  )
}

function shouldBeSelected(defaultValue: string | string[] | undefined, value: string | number) {
  if (!defaultValue) return false;

  if (Array.isArray(defaultValue)) {
    return defaultValue.includes(String(value))
  }

  return defaultValue === String(value);
}
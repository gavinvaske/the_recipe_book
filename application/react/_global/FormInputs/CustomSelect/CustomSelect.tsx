import React, { useState } from 'react';
import './CustomSelect.scss';
import { SelectOption } from '../Select/Select.tsx';
import { FieldErrors, FieldValues, UseFormRegister, Path, UseFormSetValue, Controller, Control } from 'react-hook-form';
import FormErrorMessage from '../../FormErrorMessage/FormErrorMessage.js';

type Props<T extends FieldValues> = {
  attribute: Path<T>,
  options: SelectOption[],
  label: string,
  errors: FieldErrors,
  defaultValue?: string,
  isRequired?: boolean,
  control: Control<T, any>,
  register: UseFormRegister<T>,
}

export const CustomSelect = <T extends FieldValues>(props: Props<T>) => {
  const { attribute, options, label, errors, isRequired, control, register } = props;

  const [isOpen, setIsOpen] = useState(false);

  register(attribute, 
    { required: isRequired ? "Please select an option" : undefined }
  )

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className="custom-select-container">
      <label>{label}<span className='red'>{isRequired ? '*' : ''}</span>:</label>
      <Controller
        control={control}
        name={attribute}
        render={({ field: { onChange, value } }) => (
          <div>
            {/* Selected Option: */}
            <div className="select-selected" onClick={toggleDropdown}>
              {value || `Please select an option`}
              <span className={`dropdown-arrow ${isOpen ? "active" : ""}`}>▼</span>
            </div>

            {/* All Available Options: */}
            {isOpen && <div className="select-items-v2">  {/* TODO: @Storm: I had to rename select-items -> select-items-v2 because some global class or Jquery was breaking this! Change if needed */}
              <DropdownOption 
                option={{displayName: `Please select an option`, value: ''}}
                key={-1}
                onClick={() => {
                  onChange('')
                  setIsOpen(false)
                }}
              />
              {options.map((option, index) => (
                <DropdownOption 
                  option={option} 
                  isSelected={option.value == value} 
                  key={index}
                  onClick={() => {
                    onChange(option.value)
                    setIsOpen(false)
                  }}
                />
              ))}
            </div>}
          </div>
        )}
      />
      
      <FormErrorMessage errors={errors} name={attribute} />
    </div>
  );
}

type DropdownOptionProps = {
  option: SelectOption,
  key: number,
  onClick: () => void,
  isSelected?: boolean,
}

const DropdownOption = ({ option, key, onClick, isSelected }: DropdownOptionProps) => {
  return (
    <div
      key={key}
      className={`dropdown-item ${isSelected ? "same-as-selected" : ""
        }`}
      onClick={onClick}
    >
      {option.displayName}
    </div>
  )
}
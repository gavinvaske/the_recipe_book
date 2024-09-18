import React, { useState } from 'react';
import './CustomSelect.scss';
import { SelectOption } from '../Select/Select.tsx';
import { FieldErrors, FieldValues, UseFormRegister, Path, UseFormSetValue, Controller, Control } from 'react-hook-form';

type Props<T extends FieldValues> = {
  attribute: Path<T>,
  options: SelectOption[],
  label: string,
  errors: FieldErrors,
  defaultValue?: string,
  isRequired?: boolean,
  control: Control<T, any>
}

export const CustomSelect = <T extends FieldValues>(props: Props<T>) => {
  const { attribute, options, label, errors, defaultValue, isRequired, control } = props;

  const [isOpen, setIsOpen] = useState(false);

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className="custom-select-container">
      <Controller
        control={control}
        name={attribute}
        render={({ field: { onChange, value } }) => (
          <>
            {/* Selected Option: */}
            <div className="select-selected" onClick={toggleDropdown}>
              {value || "Please select an option"}
              <span className={`dropdown-arrow ${isOpen ? "active" : ""}`}>▼</span>
            </div>

            {/* All Available Options: */}
            <div className="select-items">
              {options.map((option, index) => (
                <div
                  key={index}
                  className={`dropdown-item ${option.value == value ? "same-as-selected" : ""
                    }`}
                  onClick={() => onChange(option.value)}
                >
                  {option.displayName}
                </div>
              ))}
            </div>
          </>
        )}
      />
    </div>
  );
}
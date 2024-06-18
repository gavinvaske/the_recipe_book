import React from 'react';
import './MaterialForm'
import { MaterialFormAttributes } from '../../_types/forms/material';
import { useForm } from 'react-hook-form';
import { Input } from '../../_global/FormInputs/Input/Input';
import { Select, SelectOption } from '../../_global/FormInputs/Select/Select';

const foobarOptions: SelectOption[] = [
  {
    displayName: 'foo-1',
    value: 'bar'
  },
  {
    displayName: 'foo-2',
    value: 'bart'
  }
]

export const MaterialForm = () => {
  const { register, handleSubmit, formState: { errors } } = useForm<MaterialFormAttributes>();

  const onSubmit = (formData: MaterialFormAttributes) => {
    alert('TODO: Handle submit: ' + JSON.stringify(formData));
  };

  return (
    <form id='material-form' onSubmit={handleSubmit(onSubmit)}>
      <Input
        attribute='name'
        label="Name"
        register={register}
        isRequired={true}
        errors={errors}
      />
      <Select
        attribute='vendor'
        label="Vendor"
        options={foobarOptions}
        register={register}
        isRequired={true}
        errors={errors}
      />


      <button type="submit">Submit</button>
    </form>
  )
}

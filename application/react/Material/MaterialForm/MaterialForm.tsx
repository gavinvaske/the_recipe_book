import React from 'react';
import './MaterialForm'
import { MaterialFormAttributes } from '../../_types/forms/material';
import { useForm } from 'react-hook-form';
import { Input } from '../../_global/FormInputs/Input/Input';

export const MaterialForm = () => {
  const { register, handleSubmit, formState: { errors } } = useForm<MaterialFormAttributes>();

  const onSubmit = (formData: MaterialFormAttributes) => {
    alert('TODO: Handle submit')
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

      <button type="submit">Submit</button>
    </form>
  )
}

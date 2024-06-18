import React from 'react';
import './MaterialForm'
import { MaterialFormAttributes } from '../../_types/forms/material';
import { useForm } from 'react-hook-form';
import { Input } from '../../_global/FormInputs/Input/Input';
import { Select, SelectOption } from '../../_global/FormInputs/Select/Select';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import flashMessageStore from '../../stores/flashMessageStore';

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
  const navigate = useNavigate();

  const onSubmit = (formData: MaterialFormAttributes) => {
    axios.post(`/materials`, formData)
      .then((_) => {
        flashMessageStore.addSuccessMessage('Material was created successfully')
        navigate(`/react-ui/tables/materials`);
      })
      .catch(({response}) => {
        flashMessageStore.addErrorMessage(response.data)
      })
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

import React from 'react';
import axios, { AxiosError, AxiosResponse } from 'axios';
import './LinerTypeForm.scss';
import { LinerTypeForm } from '../../_types/forms/linerType';
import { useForm } from 'react-hook-form';
import { useNavigate } from "react-router-dom";
import flashMessageStore from '../../stores/flashMessageStore';
import { Input } from '../../_global/FormInputs/Input/Input';

export const LinerType = () => {
  const { register, handleSubmit, formState: { errors } } = useForm<LinerTypeForm>();
  const navigate = useNavigate();

  const onFormSubmit = (linerType: LinerTypeForm) => {
    axios.post('/liner-types', linerType)
      .then((_: AxiosResponse) => {
        navigate('/react-ui/tables/liner-type')
        flashMessageStore.addSuccessMessage('Liner type was created successfully')
      })
      .catch((error: AxiosError) => flashMessageStore.addErrorMessage(error.response?.data as string))
  }

  return (
    <div>
      <form onSubmit={handleSubmit(onFormSubmit)}>
        <Input
          attribute='name'
          label="Name"
          register={register}
          isRequired={true}
          errors={errors}
        />
        <button className='btn-primary' type="submit">Create Liner Type</button>
      </form>
    </div>
  )
}

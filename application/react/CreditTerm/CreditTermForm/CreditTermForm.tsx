import React from 'react';
import { useForm } from 'react-hook-form';
import axios, { AxiosError, AxiosResponse } from 'axios';
import './CreditTermForm.scss'
import FormErrorMessage from '../../_global/FormErrorMessage/FormErrorMessage';
import { CreditTermFormAttributes } from '../../_types/forms/creditTerm';
import { useNavigate } from "react-router-dom";
import flashMessageStore from '../../stores/flashMessageStore'

export const CreditTermForm = () => {
  const { register, handleSubmit, formState: { errors } } = useForm<CreditTermFormAttributes>();
  const navigate = useNavigate();

  const onSubmit = (formData: CreditTermFormAttributes) => {
    axios.post('/credit-terms', formData)
      .then((_: AxiosResponse) => {
        navigate(`/react-ui/tables/credit-term`);
        flashMessageStore.addSuccessMessage('Credit term was created successfully')
      })
      .catch((error: AxiosError) => flashMessageStore.addErrorMessage(error.response?.data as string || error.message))
  };

  return (
    <form id='credit-terms-form' onSubmit={handleSubmit(onSubmit)}>
      <label>Description*:</label>
      <input type="text" {...register('description', { required: "This is required" })} />
      <FormErrorMessage errors={errors} name="description" />

      <button type="submit">Submit</button>
    </form>
  )
}

export default CreditTermForm;
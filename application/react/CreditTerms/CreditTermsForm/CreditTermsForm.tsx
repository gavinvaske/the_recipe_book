import React from 'react';
import { useForm } from 'react-hook-form';
import axios, { AxiosError, AxiosResponse } from 'axios';
import './CreditTermsForm.scss'
import FormErrorMessage from '../../_global/FormErrorMessage/FormErrorMessage';
import { CreditTermForm } from '../../_types/forms/creditTerm';
import { useNavigate } from "react-router-dom";
import flashMessageStore from '../../stores/flashMessageStore'

const CreditTermsForm = () => {
  const { register, handleSubmit, formState: { errors } } = useForm<CreditTermForm>();
  const navigate = useNavigate();

  const onSubmit = (formData: CreditTermForm) => {
    axios.post('/credit-terms', formData)
      .then((_: AxiosResponse) => {
        navigate(`/react-ui/tables/credit-term`);
        flashMessageStore.addSuccessMessage('Credit term was created successfully')
      })
      .catch((error: AxiosError) => flashMessageStore.addErrorMessage(error.response?.data as string))
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

export default CreditTermsForm;
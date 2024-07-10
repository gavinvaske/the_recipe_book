import React from 'react';
import { useForm } from 'react-hook-form';
import axios, { AxiosError, AxiosResponse } from 'axios';
import './CreditTermForm.scss'
import { CreditTermFormAttributes } from '../../_types/forms/creditTerm';
import { useNavigate } from "react-router-dom";
import { Input } from '../../_global/FormInputs/Input/Input';
import { useErrorMessage } from '../../_hooks/useErrorMessage';
import { useSuccessMessage } from '../../_hooks/useSuccessMessage';

export const CreditTermForm = () => {
  const { register, handleSubmit, formState: { errors } } = useForm<CreditTermFormAttributes>();
  const navigate = useNavigate();

  const onSubmit = (formData: CreditTermFormAttributes) => {
    axios.post('/credit-terms', formData)
      .then((_: AxiosResponse) => {
        navigate(`/react-ui/tables/credit-term`);
        useSuccessMessage('Credit term was created successfully')
      })
      .catch((error: AxiosError) => useErrorMessage(error))
  };

  return (
    <div className='page-container'>
      <div className='form-card'>
        <div className='form-card-header'>
          <h1>Create New Credit Term</h1>
        </div>
        <div className='form-wrapper'>
          <form id='credit-terms-form' onSubmit={handleSubmit(onSubmit)} data-test='credit-term-form'>
            <Input 
              attribute='description'
              label="Description"
              register={register}
              isRequired={true}
              errors={errors}
            />
            <button className='create-entry submit-button' type="submit">Submit</button>
          </form>
        </div>
      </div>
    </div>
  )
}
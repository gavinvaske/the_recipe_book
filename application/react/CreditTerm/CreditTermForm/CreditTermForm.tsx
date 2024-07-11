import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import axios, { AxiosError, AxiosResponse } from 'axios';
import './CreditTermForm.scss'
import { CreditTermFormAttributes } from '../../_types/forms/creditTerm';
import { useNavigate, useParams } from "react-router-dom";
import { Input } from '../../_global/FormInputs/Input/Input';
import { useErrorMessage } from '../../_hooks/useErrorMessage';
import { useSuccessMessage } from '../../_hooks/useSuccessMessage';
import { getOneCreditTerm } from '../../_queries/creditTerm';
import { CreditTerm } from '../../_types/databaseModels/creditTerm';

const creditTermTableUrl = '/react-ui/tables/credit-term'

export const CreditTermForm = () => {
  const { mongooseId } = useParams();
  const { register, handleSubmit, formState: { errors }, reset } = useForm<CreditTermFormAttributes>();
  const navigate = useNavigate();

  useEffect(() => {
    if (!mongooseId) return;

    getOneCreditTerm(mongooseId)
      .then((creditTerm: CreditTerm) => {
        const formValues: CreditTermFormAttributes = {
          description: creditTerm.description
        }
        reset(formValues)
      })
      .catch((error: AxiosError) => {
        useErrorMessage(error)
        navigate(creditTermTableUrl)
      })
  }, [])

  const onSubmit = (formData: CreditTermFormAttributes) => {
    const isUpdateRequest = Boolean(mongooseId);

    if (isUpdateRequest) {
      axios.patch(`/credit-terms/${mongooseId}`, formData)
        .then((_) => {
          navigate(creditTermTableUrl)
          useSuccessMessage('Update was successful')
        })
        .catch((error: AxiosError) => useErrorMessage(error));
    } else {
      axios.post('/credit-terms', formData)
        .then((_: AxiosResponse) => {
          navigate(creditTermTableUrl);
          useSuccessMessage('Credit term was created successfully')
        })
        .catch((error: AxiosError) => useErrorMessage(error))
    }

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
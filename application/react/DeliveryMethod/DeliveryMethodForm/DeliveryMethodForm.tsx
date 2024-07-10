import React from 'react';
import { useForm } from 'react-hook-form';
import axios, { AxiosError, AxiosResponse } from 'axios';
import './DeliveryMethodForm.scss'
import { DeliveryMethodForm } from '../../_types/forms/deliveryMethod';
import { useNavigate, useParams } from "react-router-dom";
import flashMessageStore from '../../stores/flashMessageStore';
import { Input } from '../../_global/FormInputs/Input/Input';
import { useErrorHandler } from '../../_hooks/useErrorHandler';

const DeliveryMethodForm = () => {
  const { register, handleSubmit, formState: { errors } } = useForm<DeliveryMethodForm>();
  const navigate = useNavigate();

  const onSubmit = (formData: DeliveryMethodForm) => {
    axios.post('/delivery-methods', formData)
      .then((_: AxiosResponse) => {
        navigate(`/react-ui/tables/delivery-method`);
        flashMessageStore.addSuccessMessage('Delivery method was created successfully')
      })
      .catch((error: AxiosError) => useErrorHandler(error))
  };

  return (
    <div className='page-container'>
      <div className='form-card'>
        <div className='form-card-header'>
          <h1>Create New Delivery Method</h1>
        </div>
        <div className='form-wrapper'>
          <form id='delivery-method-form' onSubmit={handleSubmit(onSubmit)} data-test='delivery-method-form'>
            <Input
                attribute='name'
                label="Name"
                register={register}
                isRequired={true}
                errors={errors}
            />
            <button className='create-entry submit-button' type='submit'>Submit</button>
          </form>
        </div>
      </div>
    </div>
  )
}

export default DeliveryMethodForm;
import React from 'react';
import { useForm } from 'react-hook-form';
import axios, { AxiosError, AxiosResponse } from 'axios';
import './DeliveryMethodForm.scss'
import FormErrorMessage from '../../_global/FormErrorMessage/FormErrorMessage';
import { DeliveryMethodForm } from '../../_types/forms/deliveryMethod';
import { useNavigate } from "react-router-dom";
import flashMessageStore from '../../stores/flashMessageStore';

const DeliveryMethodForm = () => {
  const { register, handleSubmit, formState: { errors } } = useForm<DeliveryMethodForm>();
  const navigate = useNavigate();

  const onSubmit = (formData: DeliveryMethodForm) => {
    axios.post('/delivery-methods', formData)
      .then((_: AxiosResponse) => {
        navigate(`/react-ui/tables/delivery-method`);
        flashMessageStore.addSuccessMessage('Delivery method was created successfully')
      })
      .catch((error: AxiosError) => flashMessageStore.addErrorMessage(error.response?.data as string || error.message))
  };

  return (
    <form id='delivery-method-form' onSubmit={handleSubmit(onSubmit)} data-test='delivery-method-form'>
      <label>Name*:</label>
      <input type="text" {...register('name', { required: "This is required" })} />
      <FormErrorMessage errors={errors} name="name" />

      <button type="submit">Submit</button>
    </form>
  )
}

export default DeliveryMethodForm;
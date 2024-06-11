import React from 'react';
import { useForm } from 'react-hook-form';
import axios from 'axios';
import './DeliveryMethodForm.scss'
import ErrorMessage from '../../_global/FormInputErrorMessage/FormInputErrorMessage';
import { DeliveryMethodForm } from '../../_types/forms/deliveryMethod';
import { useNavigate } from "react-router-dom";
import flashMessageStore from '../../stores/flashMessageStore';

const DeliveryMethodForm = () => {
  const { register, handleSubmit, formState: { errors } } = useForm<DeliveryMethodForm>();
  const navigate = useNavigate();

  const onSubmit = (formData: DeliveryMethodForm) => {
    axios.post('/delivery-methods', formData)
      .then((_) => {
        navigate(`/react-ui/tables/delivery-method`);
        flashMessageStore.addSuccessMessage('Delivery method was created successfully')
      })
      .catch(({ response }) => {
        flashMessageStore.addErrorMessage(response.data)
      })
  };

  return (
    <form id='delivery-method-form' onSubmit={handleSubmit(onSubmit)}>
      <label>Name*:</label>
      <input type="text" {...register('name', { required: "This is required" })} />
      <ErrorMessage errors={errors} name="name" />

      <button type="submit">Submit</button>
    </form>
  )
}

export default DeliveryMethodForm;
import React from 'react';
import { useForm } from 'react-hook-form';
import axios from 'axios';
import './DeliveryMethodForm.scss'
import ErrorMessage from '../../_global/FormInputErrorMessage/FormInputErrorMessage';
import { DeliveryMethodForm } from '../../_types/forms/deliveryMethod';

const DeliveryMethodForm = () => {
  const { register, handleSubmit, formState: { errors } } = useForm<DeliveryMethodForm>();

  const onSubmit = (formData: DeliveryMethodForm) => {
    axios.post('/delivery-methods', formData)
      .then((_) => {
        window.location.href = `/react-ui/tables/delivery-method`; // TOOD: Create redirect handler to avoid hardcoding base url ("/react-ui/*")
      })
      .catch((error) => {
        alert(`An error occurred while attempting to save:\n\n${error.response.data}`);
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
import React from 'react';
import { useForm } from 'react-hook-form';
import axios from 'axios';
import './DeliveryMethodForm.scss'
import ErrorMessage from '../../_global/FormInputErrorMessage/FormInputErrorMessage';

const DeliveryMethodForm = () => {
  const { register, handleSubmit, formState: { errors } } = useForm();

  const onSubmit = (formData) => {
    axios.post('/delivery-methods', formData)
      .then((response) => {
        window.location.href = `/delivery-methods`;
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
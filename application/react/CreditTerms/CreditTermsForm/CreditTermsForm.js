import React from 'react';
import { useForm } from 'react-hook-form';
import axios from 'axios';
import './CreditTermsForm.scss'
import ErrorMessage from '../../_global/FormInputErrorMessage/FormInputErrorMessage';

const CreditTermsForm = () => {
  const { register, handleSubmit, formState: { errors } } = useForm();

  const onSubmit = (formData) => {
    axios.post('/credit-terms', formData)
      .then((response) => {
        window.location.href = `/react-ui/tables/credit-term`; // TOOD: Create redirect handler to avoid hardcoding base url ("/react-ui/*")
      })
      .catch((error) => {
        alert(`An error occurred while attempting to save:\n\n${error.response.data}`);
      })
  };

  return (
    <form id='credit-terms-form' onSubmit={handleSubmit(onSubmit)}>
      <label>Description*:</label>
      <input type="text" {...register('description', { required: "This is required" })} />
      <ErrorMessage errors={errors} name="description" />

      <button type="submit">Submit</button>
    </form>
  )
}

export default CreditTermsForm;
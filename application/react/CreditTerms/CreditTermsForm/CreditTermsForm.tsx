import React from 'react';
import { useForm } from 'react-hook-form';
import axios from 'axios';
import './CreditTermsForm.scss'
import ErrorMessage from '../../_global/FormInputErrorMessage/FormInputErrorMessage';
import { CreditTermForm } from '../../_types/forms/creditTerm';
import { useNavigate } from "react-router-dom";
import flashMessageStore from '../../stores/flashMessagesStore'

const CreditTermsForm = () => {
  const { register, handleSubmit, formState: { errors } } = useForm<CreditTermForm>();
  const navigate = useNavigate();

  const onSubmit = (formData: CreditTermForm) => {
    axios.post('/credit-terms', formData)
      .then((_) => {
        navigate(`/react-ui/tables/credit-term`);
        flashMessageStore.addSuccessMessage('Credit term was created successfully')
      })
      .catch(({response}) => {
        flashMessageStore.addErrorMessage(response.data)
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
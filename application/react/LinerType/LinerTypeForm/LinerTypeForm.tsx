import React from 'react';
import axios from 'axios';
import './LinerTypeForm.scss';
import { LinerTypeForm } from '../../_types/forms/linerType';
import { useForm } from 'react-hook-form';
import FormErrorMessage from '../../_global/FormErrorMessage/FormErrorMessage';
import { useNavigate } from "react-router-dom";
import flashMessageStore from '../../stores/flashMessageStore';

export const LinerType = () => {
  const { register, handleSubmit, formState: { errors } } = useForm<LinerTypeForm>();
  const navigate = useNavigate();

  const onFormSubmit = (linerType: LinerTypeForm) => {
    axios.post('/liner-types', linerType)
      .then((_) => {
        navigate('/react-ui/tables/liner-type')
        flashMessageStore.addSuccessMessage('Liner type was created successfully')
      })
      .catch(({ response }) => {
        flashMessageStore.addErrorMessage(response.data)
      });
  }

  return (
    <div id='customer-form'>
      <form onSubmit={handleSubmit(onFormSubmit)}>
        <div>
          <label>Name*:</label>
          <input type="text" {...register('name', { required: "This is required" })} />
          <FormErrorMessage errors={errors} name="name" />  
        </div>

        <button className='btn-primary' type="submit">Create Liner Type</button>
      </form>
    </div>
  )
}

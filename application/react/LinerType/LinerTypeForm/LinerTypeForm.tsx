import React from 'react';
import axios from 'axios';
import './LinerTypeForm.scss';
import { LinerTypeForm } from '../../_types/forms/linerType';
import { useForm } from 'react-hook-form';
import ErrorMessage from '../../_global/FormInputErrorMessage/FormInputErrorMessage';

export const LinerType = () => {
  const { register, handleSubmit, formState: { errors } } = useForm<LinerTypeForm>();

  const onFormSubmit = (linerType: LinerTypeForm) => {
    axios.post('/liner-types', linerType)
      .then(({ data }) => {
        console.log(data)
        alert('Liner Type created successfully! (TODO: Redirect to liner-types table)')
        // TODO: Add success message to the 'yet-to-be-created' "flash-messages" mobx store
        // TODO: Redirect to liner-types table
      })
      .catch(({response}) => {
        alert('Error creating LinerType: ' + response.data)
        // TODO: Add success message to the 'yet-to-be-created' "flash-messages" mobx store
      });
  }

  return (
    <div id='customer-form'>
      <form onSubmit={handleSubmit(onFormSubmit)}>
        <div>
          <label>Name*:</label>
          <input type="text" {...register('name', { required: "This is required" })} />
          <ErrorMessage errors={errors} name="name" />  
        </div>

        <button className='btn-primary' type="submit">Create Liner Type</button>
      </form>
    </div>
  )
}

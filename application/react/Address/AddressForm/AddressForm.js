import React from 'react';
import { useForm } from 'react-hook-form';
import ErrorMessage from '../../_global/FormInputErrorMessage/FormInputErrorMessage';
import './AddressForm.scss'

const AddressForm = (props) => {
  const { 
    onSubmit,
    onCancel
  } = props;
  
  const { register, handleSubmit, formState: { errors } } = useForm();

  return (
    <form id='address-form' onSubmit={handleSubmit(onSubmit)}>
      <div>
        <label>Name*:</label>
        <input type="text" {...register('name', { required: "This is required" })} />
        <ErrorMessage errors={errors} name="name" />
      </div>

      <div>
        <label>Street*:</label>
        <input type="text" {...register('street', { required: "This is required" })} />
        <ErrorMessage errors={errors} name="street" />
      </div>

      <div>
        <label>Unit or Suite #:</label>
        <input type="text" {...register('unitOrSuite')} />
        <ErrorMessage errors={errors} name="unitOrSuite" />
      </div>

      <div>
        <label>City*:</label>
        <input type="text" {...register('city', { required: "This is required" })} />
        <ErrorMessage errors={errors} name="city" />
      </div>

      <div>
        <label>State*:</label>
        <input type="text" {...register('state', { required: "This is required" })} />
        <ErrorMessage errors={errors} name="state" />
      </div>

      <div>
        <label>Zip*:</label>
        <input type="text" {...register('zipCode', { required: "This is required" })} />
        <ErrorMessage errors={errors} name="zipCode" />
      </div>

      <button type="submit">Submit</button>
      <button type="button" onClick={() => onCancel()}>Close Modal</button>
    </form>
  )
}

export default AddressForm;
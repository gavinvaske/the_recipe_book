import React from 'react';
import { useForm } from 'react-hook-form';
import ErrorMessage from '../../_global/FormInputErrorMessage/FormInputErrorMessage';
import './ShippingLocationForm.scss'

const ShippingLocationForm = (props) => {
  const { 
    onSubmit,
    onCancel
  } = props;
  
  const { register, handleSubmit, formState: { errors } } = useForm();
  return (
    <form id='shipping-location-form' onSubmit={handleSubmit(onSubmit)}>
      <label>Name*:</label>
      <input type="text" {...register('name', { required: "This is required" })} />
      <ErrorMessage errors={errors} name="name" />

      <label>Freight Account Number*:</label>
      <input type="text" {...register('freightAccountNumber', { required: "This is required" })} />
      <ErrorMessage errors={errors} name="freightAccountNumber" />

      <label>(TODO: Make this a dropdown) Delivery Method*:</label>
      <input type="text" {...register('deliveryMethod', { required: "This is required" })} />
      <ErrorMessage errors={errors} name="deliveryMethod" />

      <label>Street*:</label>
      <input type="text" {...register('street', { required: "This is required" })} />
      <ErrorMessage errors={errors} name="street" />

      <label>Unit or Suite #:</label>
      <input type="text" {...register('unitOrSuite')} />
      <ErrorMessage errors={errors} name="unitOrSuite" />

      <label>City*:</label>
      <input type="text" {...register('city', { required: "This is required" })} />
      <ErrorMessage errors={errors} name="city" />

      <label>State*:</label>
      <input type="text" {...register('state', { required: "This is required" })} />
      <ErrorMessage errors={errors} name="state" />

      <label>Zip*:</label>
      <input type="text" {...register('zipCode', { required: "This is required" })} />
      <ErrorMessage errors={errors} name="zipCode" />

      <button type="submit">Submit</button>
      <button type="button" onClick={() => onCancel()}>Close Modal</button>
    </form>
  )
}

export default ShippingLocationForm;
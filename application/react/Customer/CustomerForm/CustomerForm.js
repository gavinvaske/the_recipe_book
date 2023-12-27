import React from 'react';
import './CustomerForm.scss'
import { useForm } from 'react-hook-form';
import ErrorMessage from '../../_global/FormInputErrorMessage/FormInputErrorMessage';
import AddressForm from '../../AddressForm/AddressForm';
import ShippingLocationForm from '../../ShippingLocationForm/ShippingLocationForm';

const CustomerForm = () => {
  const { register, handleSubmit, formState: { errors } } = useForm();

  const onSubmit = (data) => {
    alert('you submitted the form:', data)
    console.log(data);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>

      <label>Customer ID*:</label>
      <input type="text" {...register('customerId', { required: "This is required" })} />
      <ErrorMessage errors={errors} name="customerId" />

      <label>Full Name*:</label>
      <input type="text" {...register('name', { required: "This is required" })} />
      <ErrorMessage errors={errors} name="name" />

      <label>Notes</label>
      <input type="text" {...register('notes', { })} />
      <ErrorMessage errors={errors} name="notes" />

      <label>Overun</label>
      <input type="text" {...register('overun', { })} />
      <ErrorMessage errors={errors} name="overun" />

      <AddressForm />
      <ShippingLocationForm />

      <button type="submit">Submit</button>
    </form>
  );
}

export default CustomerForm;
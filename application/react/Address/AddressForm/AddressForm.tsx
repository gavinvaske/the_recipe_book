import React from 'react';
import { useForm } from 'react-hook-form';
import './AddressForm.scss'
import { Input } from '../../_global/FormInputs/Input/Input';

const AddressForm = (props) => {
  const { 
    onSubmit,
    onCancel
  } = props;
  
  const { register, handleSubmit, formState: { errors } } = useForm();

  return (
    <form id='address-form' onSubmit={handleSubmit(onSubmit)}>
      <Input
        attribute='name'
        label="Name"
        register={register}
        isRequired={true}
        errors={errors}
      />
      <Input
        attribute='street'
        label="Street"
        register={register}
        isRequired={true}
        errors={errors}
      />
      <Input
        attribute='unitOrSuite'
        label="Unit or Suite #"
        register={register}
        isRequired={false}
        errors={errors}
      />
      <Input
        attribute='city'
        label="City"
        register={register}
        isRequired={true}
        errors={errors}
      />
      <Input
        attribute='state'
        label="State"
        register={register}
        isRequired={true}
        errors={errors}
      />
      <Input
        attribute='zipCode'
        label="Zip"
        register={register}
        isRequired={true}
        errors={errors}
      />

      <button type="submit">Submit</button>
      <button type="button" onClick={() => onCancel()}>Close Modal</button>
    </form>
  )
}

export default AddressForm;
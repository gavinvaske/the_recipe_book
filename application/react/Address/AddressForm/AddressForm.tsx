import React from 'react';
import { useForm } from 'react-hook-form';
import './AddressForm.scss'
import { Input } from '../../_global/FormInputs/Input/Input';

export const AddressForm = (props) => {
  const { 
    onSubmit,
    onCancel
  } = props;
  
  const { register, handleSubmit, formState: { errors } } = useForm();

  return (
    <div className='modal-content'>
      <div className='header'>
        <h2>New Address</h2>
      </div>
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
        <div className='triple-column-container'>
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
        </div>
        <button className='submit-button' type="submit">Submit</button>
      </form>
    </div>
  )
}

export type AddressFormAttributes = {
  name: string,
  street: string,
  city: string,
  state: string,
  zipCode: string,
  unitOrSuite?: string
}
import React from 'react';
import './AddressForm.scss'
import { Input } from '../../_global/FormInputs/Input/Input';

interface Props {
  header?: string;
  onSubmit?: (data: any) => void;
  customClass?: string;
  register: any;
  errors: any;
  handleSubmit?: any;  // TODO: ???
  attribute: string;
}

export const AddressForm = (props: Props) => {  // TODO: Rename AddressForm to AddressFormInputs
  const {
    header,
    onSubmit,
    customClass,
    register,
    errors,
    attribute,
    handleSubmit
  } = props;

  const attr = attribute;

  return (
    <div className={customClass}>
      <div className='header'>
        <h2>{header ? header : 'New Address'}</h2>
      </div>
      <form id='address-form' onSubmit={handleSubmit(onSubmit)}>
        <div className='input-group-wrapper'>
          <Input
            attribute={`${attr}.name`}
            label="Name"
            register={register}
            isRequired={true}
            errors={errors}
          />
          <Input
            attribute={`${attr}.street`}
            label="Street"
            register={register}
            isRequired={true}
            errors={errors}
          />
          <Input
            attribute={`${attr}.unitOrSuite`}
            label="Unit or Suite #"
            register={register}
            isRequired={false}
            errors={errors}
          />
          <Input
            attribute={`${attr}.city`}
            label="City"
            register={register}
            isRequired={true}
            errors={errors}
          />
          <Input
            attribute={`${attr}.state`}
            label="State"
            register={register}
            isRequired={true}
            errors={errors}
          />
          <Input
            attribute={`${attr}.zipCode`}
            label="Zip"
            register={register}
            isRequired={true}
            errors={errors}
          />
        </div>
        {onSubmit ? (<button className='submit-button'>Submit</button>) : null}
        </form>
    </div>
  )
}

export type AddressFormAttributes = {
  name: string,
  street: string,
  unitOrSuite?: string
  city: string,
  state: string,
  zipCode: string,
}
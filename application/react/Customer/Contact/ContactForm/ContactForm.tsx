import React from 'react';
import { useForm } from'react-hook-form';
import './ContactForm.scss'
import { AddressFormAttributes } from '../../../Address/AddressForm/AddressForm';
import { Input } from '../../../_global/FormInputs/Input/Input';
import { Select, SelectOption } from '../../../_global/FormInputs/Select/Select';
import { ShippingLocationFormAttributes } from '../../../ShippingLocation/ShippingLocationForm/ShippingLocationForm';

export const ContactForm = (props) => {
  const { 
    onSubmit,
    onCancel,
    locations
  }: {
    onSubmit: any, 
    onCancel: any, 
    locations: (AddressFormAttributes | ShippingLocationFormAttributes)[]
  } = props;

  const selectableLocations: SelectOption[] = locations.map((address: AddressFormAttributes | ShippingLocationFormAttributes, index: number) => {
    return {
      displayName: `${address.name}: ${address.street}, ${address.city}, ${address.state}, ${address.zipCode}`,
      value: `${index}`
    }
  });

  const { register, handleSubmit, formState: { errors } } = useForm<ContactFormAttributes>();

  return (
    <form id='contact-form' onSubmit={handleSubmit(onSubmit)}>
      <Input
          attribute='fullName'
          label="Name"
          register={register}
          isRequired={true}
          errors={errors}
      />
      <Input
          attribute='phoneNumber'
          label="Phone Number"
          register={register}
          isRequired={false}
          errors={errors}
      />
      <Input
          attribute='phoneExtension'
          label="Phone Extension"
          register={register}
          isRequired={false}
          errors={errors}
      />
      <Input
          attribute='email'
          label="Email"
          register={register}
          isRequired={false}
          errors={errors}
      />
      <Input
          attribute='contactStatus'
          label="Contact Status"
          register={register}
          isRequired={true}
          errors={errors}
      />
      <Input
          attribute='notes'
          label="Notes"
          register={register}
          isRequired={false}
          errors={errors}
      />
      <Input
          attribute='position'
          label="Position"
          register={register}
          isRequired={false}
          errors={errors}
      />
      <Select 
        attribute='location'
        label="Location"
        options={selectableLocations}
        register={register}
        isRequired={false}
        errors={errors}
        isMultiSelect={true}
      />
    <button type="submit">Submit</button>
    <button type="button" onClick={() => onCancel()}>Close Modal</button>
  </form>
  )
}

export type ContactFormAttributes = {
  fullName: string,
  phoneNumber: string,
  phoneExtension: string,
  email: string,
  contactStatus: string,
  notes: string,
  position: string,
  location: AddressFormAttributes
}
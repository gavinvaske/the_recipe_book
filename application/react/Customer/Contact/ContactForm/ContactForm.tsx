import React from 'react';
import { useForm } from'react-hook-form';
import './ContactForm.scss'
import { AddressFormAttributes } from '../../../Address/AddressForm/AddressForm';
import { Input } from '../../../_global/FormInputs/Input/Input';
import { SelectOption } from '../../../_global/FormInputs/Select/Select';
import { ShippingLocationFormAttributes } from '../../../ShippingLocation/ShippingLocationForm/ShippingLocationForm';
import { CustomSelect } from '../../../_global/FormInputs/CustomSelect/CustomSelect';

interface Props {
  onSubmit: (contact: any) => void, 
  onCancel: () => void, 
  locations: (AddressFormAttributes | ShippingLocationFormAttributes)[]
}
export const ContactForm = (props: Props) => {
  const { 
    onSubmit,
    locations
  } = props;

  const selectableLocations: SelectOption[] = locations.map((address: AddressFormAttributes | ShippingLocationFormAttributes, index: number) => {
    return {
      displayName: `${address.name}: ${address.street}, ${address.city}, ${address.state}, ${address.zipCode}`,
      value: `${index}`
    }
  });

  const { register, handleSubmit, formState: { errors }, control } = useForm<ContactFormAttributes>();

  return (
    <div className='modal-content'>
      <div className='header'>
        <h2>New Business Contact</h2>
      </div>
      <form id='contact-form' onSubmit={handleSubmit(onSubmit)}>
        <div className='double-column-container'>
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
        </div>
        <div className='triple-column-container'>
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
        </div>
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
        <CustomSelect
          attribute='location'
          label="Location"
          options={selectableLocations}
          register={register}
          isRequired={false}
          errors={errors}
          control={control}
        />
      <button className='submit-button' type="submit">Submit</button>
    </form>
  </div>
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
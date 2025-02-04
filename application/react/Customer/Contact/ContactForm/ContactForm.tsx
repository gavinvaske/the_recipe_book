import React from 'react';
import { useForm } from'react-hook-form';
import './ContactForm.scss'
import { IContactForm, IAddressForm } from '@ui/types/forms';
import { Input } from '../../../_global/FormInputs/Input/Input';
import { IShippingLocationForm } from '@ui/types/forms';
import { CustomSelect, SelectOption } from '../../../_global/FormInputs/CustomSelect/CustomSelect';
import { TextArea } from '../../../_global/FormInputs/TextArea/TextArea';

interface Props {
  onSubmit: (contact: any) => void, 
  onCancel: () => void, 
  locations: (IAddressForm | IShippingLocationForm)[]
}
export const ContactForm = (props: Props) => {
  const { 
    onSubmit,
    locations
  } = props;

  const selectableLocations: SelectOption[] = locations.map((address: IAddressForm | IShippingLocationForm, index: number) => {
    return {
      displayName: `${address.name}: ${address.street}, ${address.city}, ${address.state}, ${address.zipCode}`,
      value: `${index}`
    }
  });

  const { register, handleSubmit, formState: { errors }, control } = useForm<IContactForm>();

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
        <TextArea
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
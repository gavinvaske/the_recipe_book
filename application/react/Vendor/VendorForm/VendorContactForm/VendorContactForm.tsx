import React from 'react';
import { useForm } from'react-hook-form';
import './VendorContactForm.scss'
import { Input } from '../../../_global/FormInputs/Input/Input';
import { TextArea } from '../../../_global/FormInputs/TextArea/TextArea';
import { IVendorContact } from '@shared/types/schemas';

interface Props {
  onSubmit: (contact: VendorContactFormValues) => void, 
  onCancel: () => void, 
}

export const VendorContactForm = (props: Props) => {
  const { 
    onSubmit
  } = props;

  const { register, handleSubmit, formState: { errors } } = useForm<VendorContactFormValues>();

  return (
    <div className='modal-content'>
      <div className='header'>
        <h2>Create Vendor Contact</h2>
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
              attribute='cellPhone'
              label="Cell Phone"
              register={register}
              isRequired={false}
              errors={errors}
          />
        </div>
        <div className='triple-column-container'>
          <Input
              attribute='workPhone'
              label="Work Phone"
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
              attribute='ext'
              label="ext."
              register={register}
              isRequired={true}
              errors={errors}
          />
        </div>
        <TextArea
            attribute='title'
            label="Title"
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
        <TextArea
            attribute='notes'
            label="Notes"
            register={register}
            isRequired={false}
            errors={errors}
        />
      <button className='submit-button' type="submit">Submit</button>
    </form>
  </div>
  )
}

export type VendorContactFormValues = Pick<IVendorContact, 'fullName' | 'cellPhone' | 'workPhone' | 'ext' | 'title' | 'email' | 'notes'>;
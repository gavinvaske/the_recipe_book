import React from 'react';
import { useForm } from'react-hook-form';
import FormErrorMessage from '../../../_global/FormErrorMessage/FormErrorMessage';
import './ContactForm.scss'
import { ContactForm } from '../../../_types/forms/contact';
import { AddressForm } from '../../../_types/forms/address';
import { ShippingLocationForm } from '../../../_types/forms/shippingLocation';

const ContactForm = (props) => {
  const { 
    onSubmit,
    onCancel,
    locations
  }: {
    onSubmit: any, 
    onCancel: any, 
    locations: (AddressForm | ShippingLocationForm)[]
  } = props;

  const { register, handleSubmit, formState: { errors } } = useForm<ContactForm>();

  return (
    <form id='contact-form' onSubmit={handleSubmit(onSubmit)}>
      <div>
        <label>Name*:</label>
        <input type="text" {...register('fullName', { required: "This is required" })} />
        <FormErrorMessage errors={errors} name="fullName" />
      </div>
      <div>
        <label>Phone Number:</label>
        <input type="text" {...register('phoneNumber')} />
        <FormErrorMessage errors={errors} name="phoneNumber" />
      </div>
      <div>
        <label>Phone Extension:</label>
        <input type="text" {...register('phoneExtension')} />
        <FormErrorMessage errors={errors} name="phoneExtension" />
      </div>
      <div>
        <label>Email:</label>
        <input type="text" {...register('email')} />
        <FormErrorMessage errors={errors} name="email" />
      </div>
      <div>
        <label>Contact Status*:</label>
        <input type="text" {...register('contactStatus', { required: "This is required" })} />
        <FormErrorMessage errors={errors} name="contactStatus" />
      </div>
      <div>
        <label>Notes:</label>
        <input type="text" {...register('notes')} />
        <FormErrorMessage errors={errors} name="notes" />
      </div>
      <div>
        <label>Position:</label>
        <input type="text" {...register('position')} />
        <FormErrorMessage errors={errors} name="position" />
      </div>
      <div>
        <label>Location:</label>
        <br></br>
        <select {...register("location")}>
          <option value="">-- Select --</option>
          {
            locations.map((address, index: number) => {
              return (
                <option key={index} value={index}>
                    {address.name}: {address.street}, {address.city}, {address.state}, {address.zipCode}
                </option>
              )
            })
          }
        </select>
      </div>
      

    <button type="submit">Submit</button>
    <button type="button" onClick={() => onCancel()}>Close Modal</button>
  </form>
  )
}

export default ContactForm;
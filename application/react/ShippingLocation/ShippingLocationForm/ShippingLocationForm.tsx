import React, { useEffect, useState } from 'react';
import axios, { AxiosError, AxiosResponse } from 'axios';
import { useForm } from 'react-hook-form';
import './ShippingLocationForm.scss'
import { Input } from '../../_global/FormInputs/Input/Input';
import { useErrorMessage } from '../../_hooks/useErrorMessage';
import { AddressFormAttributes } from '../../Address/AddressForm/AddressForm';
import { MongooseId } from '../../_types/typeAliases';
import { CustomSelect, SelectOption } from '../../_global/FormInputs/CustomSelect/CustomSelect.tsx';
import { IDeliveryMethod } from '@shared/types/models.ts';

interface Props {
  onSubmit: (data: ShippingLocationFormAttributes) => void
}

export const  ShippingLocationForm = (props: Props) => {
  const { 
    onSubmit,
  } = props;

  const [ deliveryMethods, setDeliveryMethods ] = useState<SelectOption[]>([]);

  useEffect(() => {
    axios.get('/delivery-methods')
      .then((response: AxiosResponse) => {
        const deliveryMethods: IDeliveryMethod[] = response.data;

        setDeliveryMethods(deliveryMethods.map((deliveryMethod: IDeliveryMethod) => (
          {
            displayName: deliveryMethod.name,
            value: deliveryMethod._id as string
          }
        )))
      })
      .catch((error: AxiosError) => useErrorMessage(error))
  }, [])
  
  const { register, handleSubmit, formState: { errors }, control } = useForm<ShippingLocationFormAttributes>();

  return (
    <div className=''>
      <div className='header'>
        <h2>New Shipping Address</h2>
      </div>
      <form id='shipping-location-form' onSubmit={handleSubmit(onSubmit)}>
        <div className='input-group-wrapper'>
          <Input
            attribute='name'
            label="Name"
            register={register}
            isRequired={true}
            errors={errors}
          />
          <Input
            attribute='freightAccountNumber'
            label="Freight Account Number"
            register={register}
            isRequired={true}
            errors={errors}
          />
          <CustomSelect
            attribute='deliveryMethod'
            label="Delivery Method"
            options={deliveryMethods}
            register={register}
            isRequired={false}
            errors={errors}
            control={control}
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
        </div>
        <button className='submit-button' type="submit">Submit</button>
      </form>
    </div>
  )
}

export type ShippingLocationFormAttributes = AddressFormAttributes & {
  freightAccountNumber?: string,
  deliveryMethod?: MongooseId
}
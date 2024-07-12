import React, { useEffect, useState } from 'react';
import axios, { AxiosError, AxiosResponse } from 'axios';
import { useForm } from 'react-hook-form';
import './ShippingLocationForm.scss'
import { DeliveryMethod } from '../../_types/databaseModels/deliveryMethod';

import { Input } from '../../_global/FormInputs/Input/Input';
import { Select, SelectOption } from '../../_global/FormInputs/Select/Select';
import { useErrorMessage } from '../../_hooks/useErrorMessage';
import { AddressFormAttributes } from '../../Address/AddressForm/AddressForm';
import { MongooseId } from '../../_types/typeAliases';

export const ShippingLocationForm = (props) => {
  const { 
    onSubmit,
    onCancel
  } = props;

  const [ deliveryMethods, setDeliveryMethods ] = useState<SelectOption[]>([]);

  useEffect(() => {
    axios.get('/delivery-methods')
      .then((response: AxiosResponse) => {
        const deliveryMethods: DeliveryMethod[] = response.data;

        setDeliveryMethods(deliveryMethods.map((deliveryMethod: DeliveryMethod) => (
          {
            displayName: deliveryMethod.name,
            value: deliveryMethod._id
          }
        )))
      })
      .catch((error: AxiosError) => useErrorMessage(error))
  }, [])
  
  const { register, handleSubmit, formState: { errors } } = useForm<ShippingLocationFormAttributes>();

  return (
    <form id='shipping-location-form' onSubmit={handleSubmit(onSubmit)}>
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
      <Select
        attribute='deliveryMethod'
        label="Delivery Method"
        options={deliveryMethods}
        register={register}
        isRequired={false}
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

export type ShippingLocationFormAttributes = AddressFormAttributes & {
  freightAccountNumber?: string,
  deliveryMethod?: MongooseId
}
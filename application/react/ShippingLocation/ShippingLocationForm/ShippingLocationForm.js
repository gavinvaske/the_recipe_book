import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useForm } from 'react-hook-form';
import ErrorMessage from '../../_global/FormInputErrorMessage/FormInputErrorMessage';
import './ShippingLocationForm.scss'

const ShippingLocationForm = (props) => {
  const { 
    onSubmit,
    onCancel
  } = props;

  const [ deliveryMethods, setDeliveryMethods ] = useState([]);

  useEffect(() => {
    axios.get('/delivery-methods?responseDataType=JSON')
      .then(({data}) => setDeliveryMethods(data))
      .catch((error) => alert('Failed to load delivery methods: ' + error.message));
  }, [])
  
  const { register, handleSubmit, formState: { errors } } = useForm();

  return (
    <form id='shipping-location-form' onSubmit={handleSubmit(onSubmit)}>
      <div>
        <label>Name*:</label>
        <input type="text" {...register('name', { required: "This is required" })} />
        <ErrorMessage errors={errors} name="name" />
      </div>

      <div>
        <label>Freight Account Number*:</label>
        <input type="text" {...register('freightAccountNumber', { required: "This is required" })} />
        <ErrorMessage errors={errors} name="freightAccountNumber" />
      </div>

      <div>
        <label>Delivery Method*:</label>
        <br></br>
        <select {...register("deliveryMethod")}>
          <option value="">-- Select --</option>
          {
            deliveryMethods.map((deliveryMethod) => {
              return (
                <option key={deliveryMethod._id} value={deliveryMethod._id}>{deliveryMethod.name}</option>
              )
            })
          }
        </select>
      </div>

      <div>
        <label>Street*:</label>
        <input type="text" {...register('street', { required: "This is required" })} />
        <ErrorMessage errors={errors} name="street" />
      </div>

      <div>
        <label>Unit or Suite #:</label>
        <input type="text" {...register('unitOrSuite')} />
        <ErrorMessage errors={errors} name="unitOrSuite" />
      </div>

      <div>
        <label>City*:</label>
        <input type="text" {...register('city', { required: "This is required" })} />
        <ErrorMessage errors={errors} name="city" />
      </div>

      <div>
        <label>State*:</label>
        <input type="text" {...register('state', { required: "This is required" })} />
        <ErrorMessage errors={errors} name="state" />
      </div>

      <div>
        <label>Zip*:</label>
        <input type="text" {...register('zipCode', { required: "This is required" })} />
        <ErrorMessage errors={errors} name="zipCode" />
      </div>

      <button type="submit">Submit</button>
      <button type="button" onClick={() => onCancel()}>Close Modal</button>
    </form>
  )
}

export default ShippingLocationForm;
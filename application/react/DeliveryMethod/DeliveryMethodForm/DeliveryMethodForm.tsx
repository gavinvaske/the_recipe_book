import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import axios, { AxiosError, AxiosResponse } from 'axios';
import './DeliveryMethodForm.scss'
import { DeliveryMethodForm } from '../../_types/forms/deliveryMethod';
import { useNavigate, useParams } from "react-router-dom";
import { Input } from '../../_global/FormInputs/Input/Input';
import { useErrorMessage } from '../../_hooks/useErrorMessage';
import { getOneDeliveryMethod } from '../../_queries/deliveryMethod';
import { DeliveryMethod } from '../../_types/databaseModels/deliveryMethod';
import { useSuccessMessage } from '../../_hooks/useSuccessMessage';

const deliveryMethodTableUrl = '/react-ui/tables/delivery-method'

const DeliveryMethodForm = () => {
  const { mongooseId } = useParams();
  const { register, handleSubmit, formState: { errors }, reset } = useForm<DeliveryMethodForm>();
  const navigate = useNavigate();

  const isUpdateRequest = mongooseId && mongooseId.length > 0;

  useEffect(() => {
    if (!isUpdateRequest) return;

    getOneDeliveryMethod(mongooseId)
      .then((deliveryMethod: DeliveryMethod) => {
        const formValues = {
          name: deliveryMethod.name
        }
        reset(formValues)
      })
      .catch((error: AxiosError) => {
        useErrorMessage(error)
        navigate(deliveryMethodTableUrl)
      })
  }, [])

  const onSubmit = (formData: DeliveryMethodForm) => {
    if (isUpdateRequest) {
      axios.patch(`/delivery-methods/${mongooseId}`, formData)
        .then((_) => {
          navigate(deliveryMethodTableUrl)
          useSuccessMessage('Update was successful')
        })
        .catch((error: AxiosError) => useErrorMessage(error));
    } else {
      axios.post('/delivery-methods', formData)
        .then((_: AxiosResponse) => {
          navigate(deliveryMethodTableUrl);
          useSuccessMessage('Delivery Method was created successfully')
        })
        .catch((error: AxiosError) => useErrorMessage(error))
    }
  };

  return (
    <div className='page-container'>
      <div className='form-card'>
        <div className='form-card-header'>
          <h1>Create New Delivery Method</h1>
        </div>
        <div className='form-wrapper'>
          <form id='delivery-method-form' onSubmit={handleSubmit(onSubmit)} data-test='delivery-method-form'>
            <Input
                attribute='name'
                label="Name"
                register={register}
                isRequired={true}
                errors={errors}
            />
            <button className='create-entry submit-button' type='submit'>{isUpdateRequest ? 'Update' : 'Create'}</button>
          </form>
        </div>
      </div>
    </div>
  )
}

export default DeliveryMethodForm;
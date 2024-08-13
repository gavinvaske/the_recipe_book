import React, { useEffect, useRef } from 'react';
import './ChangePassword.scss';
import { Input } from '../../_global/FormInputs/Input/Input';
import { useForm } from 'react-hook-form';
import axios, { AxiosError, AxiosResponse } from 'axios';
import { useSuccessMessage } from '../../_hooks/useSuccessMessage';
import { useErrorMessage } from '../../_hooks/useErrorMessage';
import { useParams } from 'react-router-dom';

export const ChangePassword = () => {
  const newPasswordFieldRef = useRef(null);
  const { register, handleSubmit, formState: { errors }, reset } = useForm();
  const { mongooseId, token } = useParams();

  useEffect(() => {
    newPasswordFieldRef.current?.focus();
  }, [])

  const onSubmit = (formData: any) => {
    axios.post('/change-password', formData)
      .then((error: AxiosResponse) => {
        useSuccessMessage('Error while attempting to change password, see the logs for more details.');
      })
      .catch((error: AxiosError) => useErrorMessage(error))
  }

  return (
    <form id='change-password-form' onSubmit={ handleSubmit(onSubmit) }>
    <Input
        attribute='newPassword'
        label="New Password"
        register={register}
        isRequired={true}
        errors={errors}
        ref={newPasswordFieldRef}
    />
    <Input
        attribute='repeatPassword'
        label="Re-type Password"
        register={register}
        isRequired={true}
        errors={errors}
        ref={newPasswordFieldRef}
    />
    <button className='create-entry submit-button' type='submit'>Login</button>
  </form>
  )
}
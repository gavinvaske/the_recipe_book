import React, { useEffect, useRef } from 'react';
import './ForgotPassword.scss';
import { useForm } from 'react-hook-form';
import axios, { AxiosError, AxiosResponse } from 'axios';
import { useSuccessMessage } from '../../_hooks/useSuccessMessage';
import { useErrorMessage } from '../../_hooks/useErrorMessage';
import { Input } from '../../_global/FormInputs/Input/Input';

export const ForgotPassword = () => {
  const resetPasswordFieldRef = useRef(null);
  const { register, handleSubmit, formState: { errors }, reset } = useForm();

  useEffect(() => {
    resetPasswordFieldRef.current?.focus();
  }, [])

  const onSubmit = (formData: any) => {
    axios.post('/auth/forgot-password', formData)
      .then((_: AxiosResponse) => {
        useSuccessMessage('If the email was associated to an account, then a password reset link was sent to your email. Please check your INBOX or SPAM folder.');
      })
      .catch((error: AxiosError) => useErrorMessage(error))
  }

  return (
    <form id='reset-password-form' onSubmit={ handleSubmit(onSubmit) }>
    <Input
        attribute='email'
        label="Email"
        register={register}
        isRequired={true}
        errors={errors}
        ref={resetPasswordFieldRef}
    />
    <button className='create-entry submit-button' type='submit'>Login</button>
  </form>
  )
}
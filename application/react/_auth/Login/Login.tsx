import React, { useEffect, useRef, useState } from 'react';
import { useAuth } from '../../_hooks/useAuth';
import { useLocation, useNavigate } from 'react-router-dom';
import { Input } from '../../_global/FormInputs/Input/Input';
import { useForm } from 'react-hook-form';
import axios from '../../axios';
import { AxiosError, AxiosResponse } from 'axios';
import { useSuccessMessage } from '../../_hooks/useSuccessMessage';
import { useErrorMessage } from '../../_hooks/useErrorMessage';

const userProfilePage = '/users/profile'

export const Login = () => {
  const { auth, setAuth } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || "/react-ui";

  const userRef = useRef(null);

  const { register, handleSubmit, formState: { errors }, reset } = useForm();

  useEffect(() => {
    userRef.current?.focus();
  }, [])

  const onSubmit = (formData: any) => {
    axios.post('/auth/login', formData)
      .then((response: AxiosResponse) => {
        const { data: jsonResponse } = response;
        const { accessToken, roles } = jsonResponse;

        if (!accessToken || !roles ) {
          console.error('Login error: ', jsonResponse)
          throw new Error('Missing accessToken and/or roles from login response')
        }

        setAuth({
          accessToken,
          roles
        })
        navigate(from, { replace: true });
        useSuccessMessage('Welcome to E.L.I')
      })
      .catch((error: AxiosError) => useErrorMessage(error))
  }

  return (
    <>
      <br></br>
      <br></br>
      <br></br>
      <br></br>
      <form id='login-form' onSubmit={handleSubmit(onSubmit)}>
        <Input
            attribute='email'
            label="Email"
            register={register}
            isRequired={true}
            errors={errors}
            ref={userRef}
        />
        <Input
            attribute='password'
            label="Password"
            register={register}
            isRequired={true}
            errors={errors}
            fieldType={'password'}
        />
        <button className='create-entry submit-button' type='submit'>Login</button>
      </form>
    </>
  )
}
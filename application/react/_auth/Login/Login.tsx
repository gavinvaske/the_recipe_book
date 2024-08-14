import React, { useEffect, useRef } from 'react';
import { useAuth } from '../../_hooks/useAuth';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Input } from '../../_global/FormInputs/Input/Input';
import { useForm } from 'react-hook-form';
import axios from 'axios';
import { AxiosError, AxiosResponse } from 'axios';
import { useSuccessMessage } from '../../_hooks/useSuccessMessage';
import { useErrorMessage } from '../../_hooks/useErrorMessage';
import './Login.scss';

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
        const { accessToken, authRoles } = jsonResponse;

        if (!accessToken || !authRoles ) {
          console.error('Login error: ', response)
          throw new Error('Missing accessToken and/or roles from login response')
        }

        setAuth({
          accessToken,
          authRoles: authRoles
        })
        navigate(from, { replace: true });
        useSuccessMessage('Welcome to E.L.I')
      })
      .catch((error: AxiosError) => useErrorMessage(error))
  }

  return (
    <>
      <form id='login-form' onSubmit={handleSubmit(onSubmit)}>
        <Input
            attribute='email'
            label="Email"
            register={register}
            isRequired={true}
            errors={errors}
            ref={userRef}
            dataAttributes={
              {'data-test': 'username-input'}
            }
        />
        <Input
            attribute='password'
            label="Password"
            register={register}
            isRequired={true}
            errors={errors}
            fieldType={'password'}
            dataAttributes={
              {'data-test': 'password-input'}
            }
        />
        <Link to='/react-ui/forgot-password' id='forgot-password-btn'>Forgot Password?</Link>
        <Link to='/react-ui/register' id='register-btn'>Sign Up</Link>
        <button className='create-entry submit-button' type='submit' data-test='login-btn'>Login</button>
      </form>
    </>
  )
}
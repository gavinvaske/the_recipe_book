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
      <div className='login-frame'>
        <div className='login-container'>
          <div className='col-left'>
            <div className='logo-header-container'>
              <svg id="Layer_2" data-name="Layer 2" xmlns="http://www.w3.org/2000/svg" version="1.1" viewBox="0 0 300 304.3">
                <g id="Layer_1-2" data-name="Layer 1-2">
                  <path class="cls-1" d="M249,203.4c-1.7,3.5-2.8,6.1-4.2,8.5-16.7,27-40.2,44.7-71.7,50.4-45.4,8.1-83.7-4.5-111.9-42-21.1-28-25.5-60.1-18.8-93.7,7.2-35.9,27.7-61.9,61-77.5,14.5-6.8,29.9-9.5,45.8-9.7,12.1-.2,20.6-9,20.3-20.3-.3-11.2-8.8-19.1-20.7-19.1-36.4,0-68.8,11.5-96.5,35.2C24.7,58.9,8.3,89.1,2.5,125c-5.1,31.5-2.7,62.4,11,91.3,22.4,47.4,59.2,77.2,111.7,85.7,35.9,5.8,70.4.7,101.7-18.4,42.3-25.9,66.5-64,72.1-113.3,2.8-24.8.5-49.3-8.5-72.9-3-7.8-8.6-12.5-17-13.1-15.4-1.2-25.2,12.9-20,28.7,5,14.9,6.9,30.3,6.1,46-.4,7.6-.8,7.9-8.1,8-15,0-30,0-44.9,0-38.1,0-76.3,0-114.4,0-7.9,0-8.6.8-6,8.4,2.1,6,4.1,12.2,7.3,17.7,20.3,34.2,70.8,41.1,101.8,14.1,3.3-2.9,6.6-4.3,10.9-4.2,11.9.2,23.7,0,35.6.1,2,0,4.1.3,7.2.5h0ZM214.6,130.7c-5.1-27.6-30.9-57.1-76.7-50.8-26,3.6-49.8,27-51.1,50.8h127.8ZM224.6,69.9c15.1,0,28-13,27.8-28.1-.2-14.9-13-27.4-27.9-27.4-15.5,0-27.9,12.8-27.7,28.6.2,14.3,13.2,26.9,27.8,26.8Z" />
                  <path class="cls-1" d="M249,203.4c-3.2-.2-5.2-.5-7.2-.5-11.9,0-23.7.1-35.6-.1-4.4,0-7.6,1.3-10.9,4.2-31,27.1-81.5,20.1-101.8-14.1-3.2-5.4-5.3-11.6-7.3-17.7-2.6-7.7-1.9-8.4,6-8.4,38.1,0,76.3,0,114.4,0,15,0,30,0,44.9,0,7.4,0,7.7-.4,8.1-8,.8-15.7-1.1-31-6.1-46-5.2-15.7,4.6-29.8,20-28.7,8.4.6,14,5.3,17,13.1,9,23.6,11.3,48.1,8.5,72.9-5.6,49.3-29.8,87.4-72.1,113.3-31.3,19.2-65.7,24.2-101.7,18.4-52.5-8.4-89.3-38.3-111.7-85.7C-.2,187.5-2.6,156.5,2.5,125c5.8-35.9,22.2-66.2,49.9-89.8C80,11.5,112.4,0,148.8,0c11.9,0,20.4,7.9,20.7,19.1.3,11.2-8.3,20.1-20.3,20.3-16,.2-31.3,2.9-45.8,9.7-33.3,15.6-53.8,41.7-61,77.5-6.8,33.6-2.3,65.7,18.8,93.7,28.2,37.5,66.5,50.1,111.9,42,31.4-5.6,55-23.4,71.7-50.4,1.5-2.4,2.5-5,4.2-8.5h0Z" />
                  <path class="cls-1" d="M214.6,130.7h-127.8c1.3-23.8,25.1-47.2,51.1-50.8,45.8-6.3,71.7,23.2,76.7,50.8Z" />
                  <path class="cls-1" d="M224.6,69.9c-14.5,0-27.6-12.6-27.8-26.8-.2-15.8,12.2-28.6,27.7-28.6,14.9,0,27.6,12.5,27.9,27.4.2,15-12.6,28-27.8,28.1Z" />
                </g>
              </svg> 
              <span>ELI</span>
            </div>
            <img className='eli-welcome-splash' src={'../images/eli-welcome-splash.png'} />
            <img className='gray-background-shape' src={'../images/gray-background-shape.png'} />
          </div>
          <div className='col-right'>
            <div className='login-form-container'>
              <div className='welcome-container'>
                <h4>Welcome to ELI.</h4>
                <p>Please sign in below.</p>
              </div>
              <form className='' id='login-form' onSubmit={handleSubmit(onSubmit)}>
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
                  <div className='remember-reset-container'>
                    <div className='checkbox-container'>
                      <input type="checkbox" id="remember" name="remember" value=""></input>
                      <label for="remember"> Remember me</label>
                    </div>
                    <div className='reset-container'>
                      <Link to='/react-ui/forgot-password' id='forgot-password-btn'>Forgot Password?</Link>
                    </div>
                  </div>
                  <button className='create-entry submit-button' type='submit' data-test='login-btn'>Login</button>
                </form>
                
                <div className='register-link-container'>
                  Don't have an account?
                  <Link to='/react-ui/register' id='register-btn'>Create Account</Link>
                </div>
            </div>

          </div>
        </div>
      </div>
    </>
  )
}
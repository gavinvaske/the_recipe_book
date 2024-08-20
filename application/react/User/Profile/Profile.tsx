import React from 'react';
import './Profile.scss';
import { getLoggedInUser } from '../../_queries/auth';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useErrorMessage } from '../../_hooks/useErrorMessage';
import { FieldValues, useForm } from 'react-hook-form';
import axios, { AxiosError, AxiosResponse } from 'axios';
import { useSuccessMessage } from '../../_hooks/useSuccessMessage';
import { Input } from '../../_global/FormInputs/Input/Input';

export const Profile = () => {
  const queryClient = useQueryClient()
  const { isError, data: loggedInUser, error } = useQuery({
    queryKey: ['get-logged-in-user'],
    queryFn: getLoggedInUser,
    initialData: []
  })
  const { register, handleSubmit, formState: { errors }, reset } = useForm<FieldValues>();

  if (isError) {
    useErrorMessage(error)
  }

  const onSubmit = (formData: any) => {
    axios.patch(`/users/me`, formData)
      .then((_: AxiosResponse) => {
        queryClient.invalidateQueries({ queryKey: ['get-logged-in-user']})
        useSuccessMessage('Update was successful')
      })
      .catch((error: AxiosError) => useErrorMessage(error))
  };

  return (
    <div id='profile-page'>
      <h1>Good Evening, {(loggedInUser && loggedInUser.fullName) || 'N/A'}</h1>
      <p>Permission Level: {(loggedInUser && loggedInUser.authRoles && JSON.stringify(loggedInUser.authRoles)) || 'None'}</p>

      <form onSubmit={handleSubmit(onSubmit)} data-test='user-form'>
        {/* User Name */}
        <Input
          attribute='username'
          label="Username"
          register={register}
          errors={errors}
        />
        {/* Full Name */}
        <Input
          attribute='fullName'
          label="Full Name"
          register={register}
          errors={errors}
        />
        {/* Job Role */}
        <Input
          attribute='jobRole'
          label="Job Role"
          register={register}
          errors={errors}
        />
        {/* Birthday */}
        <Input
          attribute='birthDate'
          label="Birth Date"
          register={register}
          errors={errors}
        />
        {/* Phone */}
        <Input
          attribute='phoneNumber'
          label="Phone"
          register={register}
          errors={errors}
        />

        <button className='create-entry submit-button' type='submit'>{'Update'}</button>
      </form>
    </div>
  )
}
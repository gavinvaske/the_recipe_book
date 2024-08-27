import React, { useEffect } from 'react';
import './Profile.scss';
import { getLoggedInUser } from '../../_queries/auth';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useErrorMessage } from '../../_hooks/useErrorMessage';
import { FieldValues, useForm } from 'react-hook-form';
import axios, { AxiosError, AxiosResponse } from 'axios';
import { useSuccessMessage } from '../../_hooks/useSuccessMessage';
import { Input } from '../../_global/FormInputs/Input/Input';
import { UploadProfilePicture } from '../../UploadProfilePicture/UploadProfilePicture';

export const Profile = () => {
  const queryClient = useQueryClient()
  const { isError, data: loggedInUser, error } = useQuery({
    queryKey: ['get-logged-in-user'],
    queryFn: getLoggedInUser,
    initialData: []
  })

  useEffect(() => {
    reset({
      username: loggedInUser?.username,
      fullName: loggedInUser?.fullName,
      phoneNumber: loggedInUser?.phoneNumber,
      jobRole: loggedInUser?.jobRole,
      birthDate: loggedInUser?.birthDate || ''
    })
  }, [loggedInUser])

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

  const hourOfDay = new Date().getHours();
  const timeBasedGreetingMessage = hourOfDay < 12 ? 'Good Morning' : hourOfDay < 18 ? 'Good Afternoon' : 'Good Evening';

  return (
    <div id='profile-page'>
      <h1>{timeBasedGreetingMessage}, {(loggedInUser && loggedInUser.fullName) || 'N/A'}</h1>
      <p>Permission(s): {(loggedInUser && loggedInUser.authRoles && JSON.stringify(loggedInUser.authRoles)) || 'None'}</p>

      <UploadProfilePicture
        apiEndpoint='/users/me/profile-picture' 
        acceptedMimeTypes={['image/jpeg', 'image/png', 'image/jpg']}
      ></UploadProfilePicture>

      <form onSubmit={handleSubmit(onSubmit)} data-test='user-form'>
        <Input
          attribute='username'
          label="Username"
          register={register}
          errors={errors}
        />
        <Input
          attribute='fullName'
          label="Full Name"
          register={register}
          errors={errors}
        />
        <Input
          attribute='jobRole'
          label="Job Role"
          register={register}
          errors={errors}
        />
        <Input
          attribute='birthDate'
          label="Birth Date"
          register={register}
          errors={errors}
        />
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
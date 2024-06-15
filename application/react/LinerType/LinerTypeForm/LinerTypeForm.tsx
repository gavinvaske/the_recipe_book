import React, { useEffect, useState, useMemo } from 'react';
import axios from 'axios';
import './LinerTypeForm.scss';
import { LinerTypeForm as LinerTypeFormAttributes } from '../../_types/forms/linerType';
import { useForm } from 'react-hook-form';
import ErrorMessage from '../../_global/FormInputErrorMessage/FormInputErrorMessage';
import { useNavigate, useParams } from "react-router-dom";
import flashMessageStore from '../../stores/flashMessageStore';
import { LinerType } from '../../_types/databaseModels/linerType';

export const LinerTypeForm = () => {
  const { mongooseId } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    if (!mongooseId) return;

    axios.get('/liner-types/' + mongooseId)
      .then(({ data }: {data: LinerType}) => {
        const formValues = {
          name: data.name
        }
        reset(formValues)
      })
      .catch(({response}) => {
        flashMessageStore.addErrorMessage(response.data)
        navigate(-1);
      })

  }, [])

  const { register, handleSubmit, formState: { errors }, reset } = useForm<LinerTypeFormAttributes>({});

  const onFormSubmit = (linerType: LinerTypeFormAttributes) => {
    const isUpdateRequest = Boolean(mongooseId);

    if (isUpdateRequest) {
      axios.patch(`/liner-types/${mongooseId ? mongooseId : ''}`, linerType)
        .then((_) => {
          navigate('/react-ui/tables/liner')
        })
        .catch(({ response }) => flashMessageStore.addErrorMessage(response.data));
    } else {
      axios.post('/liner-types', linerType)
        .then((_) => {
          navigate('/react-ui/tables/liner-type')
          flashMessageStore.addSuccessMessage('Liner type was created successfully')
        })
        .catch(({ response }) => flashMessageStore.addErrorMessage(response.data));
    }
  }

  return (
    <div id='customer-form'>
      <form onSubmit={handleSubmit(onFormSubmit)}>
        <div>
          <label>Name*:</label>
          <input type="text" {...register('name', { required: "This is required" })} />
          <ErrorMessage errors={errors} name="name" />  
        </div>

        <button className='btn-primary' type="submit">Create Liner Type</button>
      </form>
    </div>
  )
}

import React, { useEffect } from 'react';
import axios, { AxiosError } from 'axios';
import './LinerTypeForm.scss';
import { useForm } from 'react-hook-form';
import { useNavigate, useParams } from "react-router-dom";
import { Input } from '../../_global/FormInputs/Input/Input';
import { LinerType } from '../../_types/databaseModels/linerType';
import { getOneLinerType } from '../../_queries/linerType';
import { useErrorMessage } from '../../_hooks/useErrorMessage';
import { useSuccessMessage } from '../../_hooks/useSuccessMessage';

const linerTypeTableUrl = '/react-ui/tables/liner-type'

export const LinerTypeForm = () => {
  const { mongooseId } = useParams();
  const navigate = useNavigate();
  const { register, handleSubmit, formState: { errors }, reset } = useForm<LinerTypeFormAttributes>({});

  const isUpdateRequest = mongooseId && mongooseId.length > 0;

  useEffect(() => {
    if (!isUpdateRequest) return;

    getOneLinerType(mongooseId)
      .then((linerType: LinerType) => {
        const formValues: LinerTypeFormAttributes = {
          name: linerType.name
        }
        reset(formValues)
      })
      .catch((error: AxiosError) => {
        navigate(linerTypeTableUrl)
        useErrorMessage(error)
      })
  }, [])

  const onFormSubmit = (linerType: LinerTypeFormAttributes) => {
    if (isUpdateRequest) {
      axios.patch(`/liner-types/${mongooseId ? mongooseId : ''}`, linerType)
        .then((_) => {
          navigate(linerTypeTableUrl)
          useSuccessMessage('Update was successful')
        })
        .catch((error: AxiosError) => useErrorMessage(error));
    } else {
      axios.post('/liner-types', linerType)
        .then((_) => {
          navigate(linerTypeTableUrl)
          useSuccessMessage('Creation was successful')
        })
        .catch((error: AxiosError) => useErrorMessage(error));
    }
  }

  return (
    <div>
      <form onSubmit={handleSubmit(onFormSubmit)} data-test='liner-type-form'>
        <Input
          attribute='name'
          label="Name"
          register={register}
          isRequired={true}
          errors={errors}
        />
        <button className='btn-primary' type="submit">{isUpdateRequest ? 'Update' : 'Create'}</button>
      </form>
    </div>
  )
}

export type LinerTypeFormAttributes = {
  name: String
}

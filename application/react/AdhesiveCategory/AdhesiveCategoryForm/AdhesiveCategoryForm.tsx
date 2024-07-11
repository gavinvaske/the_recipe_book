import React, { useEffect } from 'react';
import './AdhesiveCategoryForm.scss';
import axios, { AxiosError, AxiosResponse } from 'axios';
import { useNavigate, useParams } from "react-router-dom";
import { useForm } from 'react-hook-form';
import { AdhesiveCategory } from '../../_types/databaseModels/adhesiveCategory';
import { Input } from '../../_global/FormInputs/Input/Input';
import { useErrorMessage } from '../../_hooks/useErrorMessage';
import { useSuccessMessage } from '../../_hooks/useSuccessMessage';
import { getOneAdhesiveCategory } from '../../_queries/adhesiveCategory';
import { AdhesiveCategoryFormAttributes } from '../../_types/forms/adhesiveCategory';

const adhesiveCategoryTableUrl = '/react-ui/tables/adhesive-category'

export const AdhesiveCategoryForm = () => {
  const { mongooseId } = useParams();
  const { register, handleSubmit, formState: { errors }, reset } = useForm<AdhesiveCategoryFormAttributes>();
  const navigate = useNavigate();

  const isUpdateRequest = mongooseId && mongooseId.length > 0;

  useEffect(() => {
    if (!isUpdateRequest) return;

    getOneAdhesiveCategory(mongooseId)
      .then((adhesiveCategory: AdhesiveCategory) => {
        const formValues: AdhesiveCategoryFormAttributes = {
          name: adhesiveCategory.name
        }
        reset(formValues)
      })
      .catch((error: AxiosError) => {
        navigate(adhesiveCategoryTableUrl)
        useErrorMessage(error)
      })
  }, [])

  const onFormSubmit = (adhesiveCategory: AdhesiveCategoryFormAttributes) => {
    if (isUpdateRequest) {
      axios.patch(`/adhesive-categories/${mongooseId}`, adhesiveCategory)
        .then((_) => {
          navigate(adhesiveCategoryTableUrl)
          useSuccessMessage('Update was successful')
        })
        .catch((error: AxiosError) => useErrorMessage(error));
    } else {
      axios.post('/adhesive-categories', adhesiveCategory)
        .then((_: AxiosResponse) => {
          navigate(adhesiveCategoryTableUrl)
          useSuccessMessage('Adhesive Category was created successfully')
        })
        .catch((error: AxiosError) => useErrorMessage(error))
    }

  }

  return (
    <div>
      <form onSubmit={handleSubmit(onFormSubmit)} data-test='adhesive-category-form'>
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
};
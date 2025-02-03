import React, { useEffect } from 'react';
import './MaterialCategoryForm.scss';
import { useNavigate, useParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { IMaterialCategory } from '@shared/types/models';
import axios, { AxiosError, AxiosResponse } from 'axios';
import { useSuccessMessage } from '../../_hooks/useSuccessMessage';
import { useErrorMessage } from '../../_hooks/useErrorMessage';
import { Input } from '../../_global/FormInputs/Input/Input';
import { getOneMaterialCategory } from '../../_queries/materialCategory';

const materialCategoryTableUrl = '/react-ui/tables/material-category'

export const MaterialCategoryForm = () => {
  const { mongooseId } = useParams();
  const { register, handleSubmit, formState: { errors }, reset } = useForm<MaterialCategoryFormAttributes>();
  const navigate = useNavigate();

  const isUpdateRequest = mongooseId && mongooseId.length > 0;

  useEffect(() => {
    if (!isUpdateRequest) return;

    getOneMaterialCategory(mongooseId)
      .then((materialCategory: IMaterialCategory) => {
        const formValues: MaterialCategoryFormAttributes = {
          name: materialCategory.name
        }
        reset(formValues)
      })
      .catch((error: AxiosError) => {
        navigate(materialCategoryTableUrl)
        useErrorMessage(error)
      })
  }, [])

  const onSubmit = (formData: MaterialCategoryFormAttributes) => {
    if (isUpdateRequest) {
      axios.patch(`/material-categories/${mongooseId}`, formData)
        .then((_) => {
          navigate(materialCategoryTableUrl)
          useSuccessMessage('Update was successful')
        })
        .catch((error: AxiosError) => useErrorMessage(error));
    } else {
      axios.post('/material-categories', formData)
        .then((_: AxiosResponse) => {
          navigate(materialCategoryTableUrl);
          useSuccessMessage('Creation was successful')
        })
        .catch((error: AxiosError) => useErrorMessage(error))
    }
  };

  return (
    <div className='page-container'>
      <div className='form-card'>
        <div className='form-card-header'>
        <h3>{isUpdateRequest ? 'Update' : 'Create'} Material Category</h3>
        </div>
        <div className='form-wrapper'>
          <form id='material-category-form' onSubmit={handleSubmit(onSubmit)} data-test='material-category-form'>
            <Input
              attribute='name'
              label="Name"
              register={register}
              isRequired={true}
              errors={errors}
            />
            {/* Let user know some form inputs had errors */}
            <p className='red'>{Object.keys(errors).length ? 'Some inputs had errors, please fix before attempting resubmission' : ''}</p>

            <button className='create-entry submit-button' type="submit">{isUpdateRequest ? 'Update' : 'Create'}</button>
          </form>
        </div>
      </div>
    </div>
  )
}

export type MaterialCategoryFormAttributes = {
  name: String
}
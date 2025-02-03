import React, { useEffect, useState } from 'react';
import './MaterialLengthAdjustmentForm.scss';
import axios, { AxiosError, AxiosResponse } from 'axios';
import { useForm } from 'react-hook-form';
import { useNavigate, useParams } from 'react-router-dom';
import { Input } from '../../_global/FormInputs/Input/Input';
import { useErrorMessage } from '../../_hooks/useErrorMessage';
import { useSuccessMessage } from '../../_hooks/useSuccessMessage';
import { MongooseId } from '../../_types/typeAliases';
import { IMaterial, IMaterialLengthAdjustment } from '@shared/types/models.ts';
import { performTextSearch } from '../../_queries/_common.ts';
import { SearchResult } from '@shared/types/http.ts';
import { CustomSelect, SelectOption } from '../../_global/FormInputs/CustomSelect/CustomSelect.tsx';
import { TextArea } from '../../_global/FormInputs/TextArea/TextArea.tsx';


export const MaterialLengthAdjustmentForm = () => {
  const { register, handleSubmit, formState: { errors }, reset, control } = useForm<MaterialLengthAdjustmentFormFormAttributes>();
  const navigate = useNavigate();
  const [materials, setMaterials] = useState<SelectOption[]>([])
  const { mongooseId } = useParams();

  const isUpdateRequest = mongooseId && mongooseId.length > 0;

  useEffect(() => {
    if (!isUpdateRequest) return;

    axios.get('/material-length-adjustments/' + mongooseId)
      .then(({ data }: { data: IMaterialLengthAdjustment }) => {
        const formValues: any = {
          material: data.material,
          length: data.length,
          notes: data.notes,
        }

        reset(formValues) // pre-populate form with existing values from the DB
      })
      .catch((error: AxiosError) => {
        useErrorMessage(error)
      })
  }, [])

  useEffect(() => {
    performTextSearch<IMaterial>('/materials/search', { limit: '100',  })
      .then((searchResults: SearchResult<IMaterial>) => {
        const materials = searchResults.results
        setMaterials(materials.map((material: IMaterial) => (
          {
            displayName: material.name,
            value: material._id as string
          }
        )))
      })
      .catch((error: AxiosError) => useErrorMessage(error))
    }, []);

  const onFormSubmit = (formData: MaterialLengthAdjustmentFormFormAttributes) => {
    if (isUpdateRequest) {
      axios.patch(`/material-length-adjustments/${mongooseId}`, formData)
        .then((_) => {
          navigate('/react-ui/tables/material-length-adjustment');
          useSuccessMessage('Update was successful')
        })
        .catch((error: AxiosError) => useErrorMessage(error))
    } else {
      axios.post('/material-length-adjustments', formData)
        .then((_: AxiosResponse) => {
          navigate('/react-ui/tables/material-length-adjustment')
          useSuccessMessage('Creation was successful')
        })
        .catch((error: AxiosError) => useErrorMessage(error))
    }
  }

  return (
    <div id='material-po-form-page-wrapper' className='page-wrapper'>
      <div className='card'>
        <div className='form-card-header'>
          <h3>Create Material Adjustment</h3>
        </div>
        <div className='form-wrapper'>
          <form onSubmit={handleSubmit(onFormSubmit)} data-test='material-length-adjustment-form'>
            <CustomSelect
              attribute='material'
              label="Material"
              options={materials}
              register={register}
              isRequired={true}
              errors={errors}
              control={control}
            />
            <Input
              attribute='length'
              label="Length"
              register={register}
              isRequired={true}
              errors={errors}
              unit='@storm'
            />
            <TextArea
              attribute='notes'
              label="Notes"
              register={register}
              isRequired={false}
              errors={errors}
            />
            {/* Let user know some form inputs had errors */}
            <p className='red'>{Object.keys(errors).length ? 'Some inputs had errors, please fix before attempting resubmission' : ''}</p>

            <button className='create-entry submit-button' type="submit">{isUpdateRequest ? 'Update' : 'Create'} </button>
          </form>
        </div>
      </div>
    </div>
  )
}

export type MaterialLengthAdjustmentFormFormAttributes = {
  material: MongooseId,
  length: number,
  notes?: string
}
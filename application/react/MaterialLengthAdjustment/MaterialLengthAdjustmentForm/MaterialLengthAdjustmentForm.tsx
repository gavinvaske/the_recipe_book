import React, { useEffect, useState } from 'react';
import './MaterialLengthAdjustmentForm.scss';
import axios, { AxiosError, AxiosResponse } from 'axios';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { MaterialLengthAdjustmentFormFormAttributes } from '../../_types/forms/materialLengthAdjustment';
import { Input } from '../../_global/FormInputs/Input/Input';
import { Select, SelectOption } from '../../_global/FormInputs/Select/Select';
import { Material } from '../../_types/databaseModels/material';
import { useErrorMessage } from '../../_hooks/useErrorMessage';
import { useSuccessMessage } from '../../_hooks/useSuccessMessage';


export const MaterialLengthAdjustmentForm = () => {
  const { register, handleSubmit, formState: { errors } } = useForm<MaterialLengthAdjustmentFormFormAttributes>();
  const navigate = useNavigate();
  const [materials, setMaterials] = useState<SelectOption[]>([])

  useEffect(() => {
    axios.get('/materials')
      .then((response : AxiosResponse) => {
        const materials: Material[] = response.data
        setMaterials(materials.map((material: Material) => (
          {
            displayName: material.name,
            value: material._id
          }
        )))
      })
      .catch((error: AxiosError) => useErrorMessage(error))
    });

  const onFormSubmit = (formData: MaterialLengthAdjustmentFormFormAttributes) => {
    axios.post('/material-length-adjustments', formData)
      .then((_: AxiosResponse) => {
        navigate('/react-ui/tables/TODO')
        useSuccessMessage('Creation was successful')
      })
      .catch((error: AxiosError) => useErrorMessage(error))
  }

  return (
    <form onSubmit={handleSubmit(onFormSubmit)} data-test='material-length-adjustment-form'>
      <Select
        attribute='material'
        label="Material"
        options={materials}
        register={register}
        isRequired={true}
        errors={errors}
      />
      <Input
        attribute='length'
        label="Length"
        register={register}
        isRequired={true}
        errors={errors}
      />
      <Input
        attribute='notes'
        label="Notes"
        register={register}
        isRequired={false}
        errors={errors}
      />
      <button className='btn-primary' type="submit">Create Material Inventory Entry</button>
    </form>
  )
}
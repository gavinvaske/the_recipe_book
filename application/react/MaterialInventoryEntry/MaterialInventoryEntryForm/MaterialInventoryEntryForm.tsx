import React, { useEffect, useState } from 'react';
import './MaterialInventoryEntryForm.scss';
import axios, { AxiosError, AxiosResponse } from 'axios';
import flashMessageStore from '../../stores/flashMessageStore';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { MaterialInventoryEntryFormAttributes } from '../../_types/forms/MaterialInventoryEntry';
import { Input } from '../../_global/FormInputs/Input/Input';
import { Select, SelectOption } from '../../_global/FormInputs/Select/Select';
import { MaterialInventoryEntry } from '../../_types/databaseModels/MaterialInventoryEntry';
import { Material } from '../../_types/databaseModels/material';


export const MaterialInventoryEntryForm = () => {
  const { register, handleSubmit, formState: { errors } } = useForm<MaterialInventoryEntryFormAttributes>();
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
      .catch((error: AxiosError) => flashMessageStore.addErrorMessage(error.response?.data as string || error.message))
    });

  const onFormSubmit = (formData: MaterialInventoryEntryFormAttributes) => {
    axios.post('/material-inventory-entry', formData)
      .then((_: AxiosResponse) => {
        navigate('/react-ui/tables/TODO')
        flashMessageStore.addSuccessMessage('Material Inventory Entry was created successfully')
      })
      .catch((error: AxiosError) => flashMessageStore.addErrorMessage(error.response?.data as string || error.message))
  }

  return (
    <form onSubmit={handleSubmit(onFormSubmit)} data-test='material-inventory-entry-form'>
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
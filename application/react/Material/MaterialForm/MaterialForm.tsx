import React from 'react';
import './MaterialForm'
import { MaterialFormAttributes } from '../../_types/forms/material';
import { useForm } from 'react-hook-form';
import { Input } from '../../_global/FormInputs/Input/Input';
import { Select, SelectOption } from '../../_global/FormInputs/Select/Select';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import flashMessageStore from '../../stores/flashMessageStore';

const vendors: SelectOption[] = []
const materialCategories: SelectOption[] = []
const adhesiveCategories: SelectOption[] = []
const linerTypes: SelectOption[] = []

export const MaterialForm = () => {
  const { register, handleSubmit, formState: { errors } } = useForm<MaterialFormAttributes>();
  const navigate = useNavigate();

  const onSubmit = (formData: MaterialFormAttributes) => {
    axios.post(`/materials`, formData)
      .then((_) => {
        flashMessageStore.addSuccessMessage('Material was created successfully')
        navigate(`/react-ui/tables/materials`);
      })
      .catch(({response}) => {
        flashMessageStore.addErrorMessage(response.data)
      })
  };

  return (
    <form id='material-form' onSubmit={handleSubmit(onSubmit)}>
      <Input
        attribute='name'
        label="Name"
        register={register}
        isRequired={true}
        errors={errors}
      />
      <Input
        attribute='materialId'
        label="Material ID"
        register={register}
        isRequired={true}
        errors={errors}
      />
      <Input
        attribute='thickness'
        label="Thickness"
        register={register}
        isRequired={true}
        errors={errors}
      />
      <Input
        attribute='weight'
        label="Weight"
        register={register}
        isRequired={true}
        errors={errors}
      />
      <Input
        attribute='costPerMsi'
        label="Cost (per MSI)"
        register={register}
        isRequired={true}
        errors={errors}
      />
      <Input
        attribute='freightCostPerMsi'
        label="Freight Cost (per MSI)"
        register={register}
        isRequired={true}
        errors={errors}
      />
      <Input
        attribute='width'
        label="Width"
        register={register}
        isRequired={true}
        errors={errors}
      />
      <Input
        attribute='faceColor'
        label="Face Color"
        register={register}
        isRequired={true}
        errors={errors}
      />
      <Input
        attribute='adhesive'
        label="Adhesive"
        register={register}
        isRequired={true}
        errors={errors}
      />
      <Input
        attribute='quotePricePerMsi'
        label="Quote Price (Per MSI)"
        register={register}
        isRequired={true}
        errors={errors}
      />
      <Input
        attribute='description'
        label="Description"
        register={register}
        isRequired={true}
        errors={errors}
      />
      <Input
        attribute='whenToUse'
        label="When-to-use"
        register={register}
        isRequired={true}
        errors={errors}
      />
      <Input
        attribute='alternativeStock'
        label="Alternative Stock"
        register={register}
        isRequired={false}
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
        attribute='facesheetWeightPerMsi'
        label="Facesheet Weight (Per MSI)"
        register={register}
        isRequired={true}
        errors={errors}
      />
      <Input
        attribute='adhesiveWeightPerMsi'
        label="Adhesive Weight (Per MSI)"
        register={register}
        isRequired={true}
        errors={errors}
      />
      <Input
        attribute='linerWeightPerMsi'
        label="Liner Weight (Per MSI)"
        register={register}
        isRequired={true}
        errors={errors}
      />
      <Input
        attribute='location'
        label="Location"
        register={register}
        isRequired={true}
        errors={errors}
      />
      <Input
        attribute='productNumber'
        label="Product Number"
        register={register}
        isRequired={true}
        errors={errors}
      />
      <Input
        attribute='masterRollSize'
        label="Master Roll Size"
        register={register}
        isRequired={true}
        errors={errors}
      />
      <Input
        attribute='image'
        label="Image"
        register={register}
        isRequired={true}
        errors={errors}
      />
      <Select
        attribute='linerType'
        label="Liner Type"
        options={linerTypes}
        register={register}
        isRequired={true}
        errors={errors}
      />
      <Select
        attribute='adhesiveCategory'
        label="Adhesive Category"
        options={adhesiveCategories}
        register={register}
        isRequired={true}
        errors={errors}
      />
      <Select
        attribute='vendor'
        label="Vendor"
        options={vendors}
        register={register}
        isRequired={true}
        errors={errors}
      />
      <Select
        attribute='materialCategory'
        label="Material Category"
        options={materialCategories}
        register={register}
        isRequired={true}
        errors={errors}
      />


      <button type="submit">Submit</button>
    </form>
  )
}

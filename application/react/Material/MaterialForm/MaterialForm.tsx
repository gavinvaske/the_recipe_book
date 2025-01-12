import React, { useEffect, useState } from 'react';
import './MaterialForm.scss'
import { useForm } from 'react-hook-form';
import { Input } from '../../_global/FormInputs/Input/Input';
import { Select, SelectOption } from '../../_global/FormInputs/Select/Select';
import { AxiosError, AxiosResponse } from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import { Vendor } from '../../_types/databasemodels/vendor.ts';
import { MaterialCategory } from '../../_types/databasemodels/materialCategory.ts';
import { AdhesiveCategory } from '../../_types/databasemodels/adhesiveCategory.ts';
import { LinerType } from '../../_types/databasemodels/linerType.ts';
import { IMaterial } from '../../../api/models/material.ts';
import { useErrorMessage } from '../../_hooks/useErrorMessage';
import { useSuccessMessage } from '../../_hooks/useSuccessMessage';
import { MongooseId } from '../../_types/typeAliases';
import { useAxios } from '../../_hooks/useAxios';
import { MaterialLocationSelector } from './MaterialLocationSelector/MaterialLocationSelector.tsx';

const materialTableUrl = '/react-ui/tables/material'

export const MaterialForm = () => {
  const { register, handleSubmit, formState: { errors }, reset, setValue, getValues, watch } = useForm<IMaterialFormAttributes>();
  const navigate = useNavigate();
  const { mongooseId } = useParams();
  const axios = useAxios();

  const isUpdateRequest = mongooseId && mongooseId.length > 0;

  const [vendors, setVendors] = useState<SelectOption[]>([])
  const [materialCategories, setMaterialCategories] = useState<SelectOption[]>([])
  const [adhesiveCategories, setAdhesiveCategories] = useState<SelectOption[]>([])
  const [linerTypes, setLinerTypes] = useState<SelectOption[]>([])

  useEffect(() => {
    if (!isUpdateRequest) return;

    axios.get('/materials/' + mongooseId)
      .then(({ data }: { data: IMaterial }) => {
        console.log('material locations: ', data.locations)
        const formValues: IMaterialFormAttributes = {
          name: data.name,
          materialId: data.materialId,
          thickness: data.thickness,
          weight: data.weight,
          costPerMsi: data.costPerMsi,
          freightCostPerMsi: data.freightCostPerMsi,
          width: data.weight,
          faceColor: data.faceColor,
          adhesive: data.adhesive,
          quotePricePerMsi: data.quotePricePerMsi,
          description: data.description,
          whenToUse: data.whenToUse,
          alternativeStock: data.alternativeStock,
          length: data.length,
          facesheetWeightPerMsi: data.facesheetWeightPerMsi,
          adhesiveWeightPerMsi: data.adhesiveWeightPerMsi,
          linerWeightPerMsi: data.linerWeightPerMsi,
          locations: data.locations,
          productNumber: data.productNumber,
          masterRollSize: data.masterRollSize,
          image: data.image,
          linerType: data.linerType,
          adhesiveCategory: data.adhesiveCategory,
          vendor: data.vendor,
          materialCategory: data.materialCategory
        }

        reset(formValues) // pre-populate form with existing values from the DB
      })
      .catch((error: AxiosError) => {
        useErrorMessage(error)
      })
  }, [])

  useEffect(() => {
    axios.get('/vendors')
      .then((response : AxiosResponse) => {
        const vendors: Vendor[] = response.data
        setVendors(vendors.map((vendor: Vendor) => (
          {
            displayName: vendor.name,
            value: vendor._id
          }
        )))
      })
      .catch((error: AxiosError) => useErrorMessage(error))

    axios.get('/material-categories')
      .then((response : AxiosResponse) => {
        const materialCategories: MaterialCategory[] = response.data
        setMaterialCategories(materialCategories.map((materialCategory: MaterialCategory) => (
          {
            displayName: materialCategory.name,
            value: materialCategory._id
          }
        )))
      })
      .catch((error: AxiosError) => useErrorMessage(error))

    axios.get('/adhesive-categories')
      .then((response : AxiosResponse) => {
        const adhesiveCategories: AdhesiveCategory[] = response.data
        setAdhesiveCategories(adhesiveCategories.map((adhesiveCategory: AdhesiveCategory) => (
          {
            displayName: adhesiveCategory.name,
            value: adhesiveCategory._id
          }
        )))
      })
      .catch((error: AxiosError) => useErrorMessage(error))

    axios.get('/liner-types')
      .then((response : AxiosResponse) => {
        const linerTypes: LinerType[] = response.data
        setLinerTypes(linerTypes.map((linerType: LinerType) => (
          {
            displayName: linerType.name,
            value: linerType._id
          }
        )))
      })
      .catch((error: AxiosError) => useErrorMessage(error))
  }, [])

  const onSubmit = (formData: IMaterialFormAttributes) => {
    if (isUpdateRequest) {
      axios.patch(`/materials/${mongooseId}`, formData)
        .then((_) => {
          navigate(materialTableUrl);
          useSuccessMessage('Update was successful')
        })
        .catch((error: AxiosError) => useErrorMessage(error))
    } else {
      axios.post(`/materials`, formData)
        .then((_) => {
          navigate(materialTableUrl);
          useSuccessMessage('Creation was successful')
        })
        .catch((error: AxiosError) => useErrorMessage(error))
    }
  };

  return (
    <div className='page-wrapper'>
      <div className='card'>
        <div className='form-card-header'>
          <h3>{isUpdateRequest ? 'Edit' : 'Create'} Material</h3>
        </div>
        <div className='form-wrapper'>
          <form id='material-form' className='material-form' onSubmit={handleSubmit(onSubmit)} data-test='material-form'>
            <div className='form-elements-wrapper'>
              <div className='group-field-wrapper'>
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
                <MaterialLocationSelector 
                  setValue={setValue}
                  getValues={getValues}
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

              </div>
              <button className='create-entry submit-button' type="submit">{isUpdateRequest ? 'Update' : 'Create'}</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export interface IMaterialFormAttributes {
  name: string;
  materialId: string;
  vendor: MongooseId;
  materialCategory: MongooseId;
  thickness: number;
  weight: number;
  costPerMsi: number;
  freightCostPerMsi: number;
  width: number;
  faceColor: string;
  adhesive: string;
  adhesiveCategory: MongooseId;
  quotePricePerMsi: number;
  description: string;
  whenToUse: string;
  alternativeStock?: string;
  length: number;
  facesheetWeightPerMsi: number;
  adhesiveWeightPerMsi: number;
  linerWeightPerMsi: number;
  locations: string[];
  linerType: MongooseId;
  productNumber: string;
  masterRollSize: number;
  image: string;
}
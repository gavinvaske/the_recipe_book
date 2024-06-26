import React, { useEffect, useState } from 'react';
import './MaterialForm.scss'
import { MaterialFormAttributes } from '../../_types/forms/material';
import { useForm } from 'react-hook-form';
import { Input } from '../../_global/FormInputs/Input/Input';
import { Select, SelectOption } from '../../_global/FormInputs/Select/Select';
import axios, { AxiosError, AxiosResponse } from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import flashMessageStore from '../../stores/flashMessageStore';
import { Vendor } from '../../_types/databaseModels/vendor';
import { MaterialCategory } from '../../_types/databaseModels/materialCategory';
import { AdhesiveCategory } from '../../_types/databaseModels/adhesiveCategory';
import { LinerType } from '../../_types/databaseModels/linerType';
import { Material } from '../../_types/databaseModels/material';

export const MaterialForm = () => {
  const { register, handleSubmit, formState: { errors }, reset } = useForm<MaterialFormAttributes>();
  const navigate = useNavigate();
  const { mongooseId } = useParams();

  const [vendors, setVendors] = useState<SelectOption[]>([])
  const [materialCategories, setMaterialCategories] = useState<SelectOption[]>([])
  const [adhesiveCategories, setAdhesiveCategories] = useState<SelectOption[]>([])
  const [linerTypes, setLinerTypes] = useState<SelectOption[]>([])

  useEffect(() => {
    if (!mongooseId) return;

    axios.get('/materials/' + mongooseId)
      .then(({ data }: {data: Material}) => {
        const formValues: MaterialFormAttributes = {
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
          location: data.location,
          productNumber: data.productNumber,
          masterRollSize: data.masterRollSize,
          image: data.image,
          linerType: data.linerType,
          adhesiveCategory: data.adhesiveCategory as string,
          vendor: data.vendor as string,
          materialCategory: data.materialCategory as string
        }

        reset(formValues) // pre-populate form with existing values from the DB
      })
      .catch((error: AxiosError) => {
        flashMessageStore.addErrorMessage(error.response?.data as string || error.message)
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
      .catch((error: AxiosError) => flashMessageStore.addErrorMessage(error.response?.data as string || error.message))

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
      .catch((error: AxiosError) => flashMessageStore.addErrorMessage(error.response?.data as string || error.message))

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
      .catch((error: AxiosError) => flashMessageStore.addErrorMessage(error.response?.data as string || error.message))

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
      .catch((error: AxiosError) => flashMessageStore.addErrorMessage(error.response?.data as string || error.message))
  }, [])

  const onSubmit = (formData: MaterialFormAttributes) => {
    axios.post(`/materials`, formData)
      .then((_) => {
        flashMessageStore.addSuccessMessage('Material was created successfully')
        navigate(`/react-ui/tables/materials`);
      })
      .catch((error: AxiosError) => {
        console.log('error', error);
        flashMessageStore.addErrorMessage(error.response?.data as string || error.message)
      })
  };

  return (
    <div className='page-container'>
      <div className='form-card'>
        <div className='form-card-header'>
          <h1>Create New Material</h1>
        </div>
        <div className='form-wrapper'>
          <form id='material-form' className='material-form' onSubmit={handleSubmit(onSubmit)}>
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

                <div className="field-label-wrapper half-width">
                    <label for="test">Vendor:</label>
                    <div className="custom-select" style={{width:"200"}}>
                    <select id="test" className="test">
                      <option value="0">Select car:</option>
                      <option value="1">Audi</option>
                      <option value="2">BMW</option>
                      <option value="3">Citroen</option>
                      <option value="4">Ford</option>
                      <option value="5">Honda</option>
                      <option value="6">Jaguar</option>
                      <option value="7">Land Rover</option>
                      <option value="8">Mercedes</option>
                      <option value="9">Mini</option>
                      <option value="10">Nissan</option>
                      <option value="11">Toyota</option>
                      <option value="12">Volvo</option>
                    </select>
                  </div>
                </div>


              </div>

              <button className='create-entry submit-button' type="submit">Submit</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

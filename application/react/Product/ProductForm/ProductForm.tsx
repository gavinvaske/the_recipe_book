import React, { useEffect, useState } from 'react';
import './ProductForm.scss';
import { Input } from '../../_global/FormInputs/Input/Input';
import { useNavigate, useParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { MongooseId } from '../../_types/typeAliases';
import { unwindDirections } from '../../../api/enums/unwindDirectionsEnum';
import { ovOrEpmOptions } from '../../../api/enums/ovOrEpmEnum';
import { finishTypes } from '../../../api/enums/finishTypesEnum';
import { useErrorMessage } from '../../_hooks/useErrorMessage';
import { Select, SelectOption } from '../../_global/FormInputs/Select/Select';
import { getMaterials } from '../../_queries/material';
import { getCustomers } from '../../_queries/customer';
import { getOneProduct } from '../../_queries/product';
import { getDies } from '../../_queries/die';
import { getFinishes } from '../../_queries/finish';

export const ProductForm = () => {
  const { mongooseId } = useParams();
  const isUpdateRequest = mongooseId && mongooseId.length > 0;

  const [dies, setDies] = useState<SelectOption[]>([])
  const [materials, setMaterials ] = useState<SelectOption[]>([])
  const [finishes, setFinishes ] = useState<SelectOption[]>([])
  const [customers, setCustomers ] = useState<SelectOption[]>([])

  const { register, handleSubmit, formState: { errors }, reset } = useForm<ProductFormAttributes>();
  const navigate = useNavigate();

  const preloadFormData = async () => {
    const dies = await getDies();
    const materials = await getMaterials();
    const customers = await getCustomers();
    const finishes = await getFinishes();

    setDies(dies.map((die) => ({ value: die._id, displayName: 'foo' })));
    setMaterials(materials.map((material) => ({ value: material._id, displayName: 'foo' })));
    setFinishes(finishes.map((finish) => ({ value: finish._id, displayName: 'foo' })));
    setCustomers(customers.map((customer) => ({ value: customer._id, displayName: 'foo' })));

    if (!isUpdateRequest) return;

    const product = await getOneProduct(mongooseId)

    const formValues: ProductFormAttributes = {
      productDescription: product.productDescription,
      unwindDirection: product.unwindDirection,
      ovOrEpm: product.ovOrEpm,
      artNotes: product.artNotes,
      pressNotes: product.pressNotes,
      finishType: product.finishType,
      coreDiameter: product.coreDiameter,
      labelsPerRoll: product.labelsPerRoll,
      dieCuttingNotes: product.dieCuttingNotes,
      overun: product.overun,
      spotPlate: product.spotPlate,
      numberOfColors: product.numberOfColors,
      die: product.die,
      frameNumberAcross: product.frameNumberAcross,
      frameNumberAround: product.frameNumberAround,
      primaryMaterial: product.primaryMaterial,
      secondaryMaterial: product.secondaryMaterial,
      finish: product.finish,
      customer: product.customer
    }

    reset(formValues) // Loads data into the form and forces a rerender
  }


  useEffect(() => {
    preloadFormData()
      .catch((error) => {
        useErrorMessage(error)
      })
  }, [])

  const onSubmit = (formData: ProductFormAttributes) => {
    // if (isUpdateRequest) {
    //   axios.patch(`/delivery-methods/${mongooseId}`, formData)
    //     .then((_) => {
    //       navigate(deliveryMethodTableUrl)
    //       useSuccessMessage('Update was successful')
    //     })
    //     .catch((error: AxiosError) => useErrorMessage(error));
    // } else {
    //   axios.post('/delivery-methods', formData)
    //     .then((_: AxiosResponse) => {
    //       navigate(deliveryMethodTableUrl);
    //       useSuccessMessage('Creation was successful')
    //     })
    //     .catch((error: AxiosError) => useErrorMessage(error))
    // }
  };

  return (
    <div className='page-container'>
      <div className='form-card'>
        <div className='form-card-header'>
          <h1>Create New Delivery Method</h1>
        </div>
        <div className='form-wrapper'>
          <form onSubmit={handleSubmit(onSubmit)}>
            <Input
              attribute='productDescription'
              label="Product Description"
              register={register}
              errors={errors}
            />
            <Select
              attribute='unwindDirection'
              label='Unwind Direction'
              options={unwindDirections.map((direction) => ({ value: String(direction), displayName: String(direction) }))}
              register={register}
              errors={errors}
            />
            <Select
              attribute='ovOrEpm'
              label='OV / EPM'
              options={ovOrEpmOptions.map((option) => ({ value: option, displayName: option }))}
              register={register}
              errors={errors}
            />
            <Input
              attribute='artNotes'
              label="Art Notes"
              register={register}
              errors={errors}
            />
            <Input
              attribute='pressNotes'
              label="Press Notes"
              register={register}
              errors={errors}
            />
            <Select
              attribute='finishType'
              label='Finish Types'
              options={finishTypes.map((finishType) => ({ value: finishType, displayName: finishType }))}
              register={register}
              errors={errors}
            />
            <Input
              attribute='coreDiameter'
              label="Core Diameter"
              register={register}
              errors={errors}
            />
            <Input
              attribute='labelsPerRoll'
              label="Labels PerRoll"
              register={register}
              errors={errors}
            />
            <Input
              attribute='dieCuttingNotes'
              label="Die Cutting Notes"
              register={register}
              errors={errors}
            />
            <Input
              attribute='overun'
              label="Overun"
              register={register}
              errors={errors}
            />
            <Input
              attribute='spotPlate'
              label="Has Spot Plate"
              register={register}
              errors={errors}
              fieldType='checkbox'
            />
            <Input
              attribute='numberOfColors'
              label="Number of Colors"
              register={register}
              errors={errors}
            />
            <Select 
              attribute='die'
              label="Die"
              options={dies}
              register={register}
              errors={errors}
            />
            <Input
              attribute='frameNumberAcross'
              label="Frame Number Across"
              register={register}
              errors={errors}
            />
            <Input
              attribute='frameNumberAround'
              label="Frame Number Around"
              register={register}
              errors={errors}
            />
            <Select 
              attribute='primaryMaterial'
              label="Primary Material"
              options={materials}
              register={register}
              errors={errors}
            />
            <Select 
              attribute='secondaryMaterial'
              label="Secondary Material"
              options={materials}
              register={register}
              errors={errors}
            />
            <Select 
              attribute='finish'
              label="Finish"
              options={finishes}
              register={register}
              errors={errors}
            />
            <Select 
              attribute='customer'
              label="Customer"
              options={customers}
              register={register}
              errors={errors}
            />
            <button className='create-entry submit-button' type='submit'>{isUpdateRequest ? 'Update' : 'Create'}</button>
          </form>
        </div>
      </div>
    </div>
  )
}

type ProductFormAttributes = {
  productDescription: string;
  unwindDirection: number;
  ovOrEpm: string;
  artNotes: string;
  pressNotes: string;
  finishType: string;
  coreDiameter: number;
  labelsPerRoll: number;
  dieCuttingNotes: string;
  overun: number;
  spotPlate: boolean;
  numberOfColors: number;
  die: MongooseId;
  frameNumberAcross: number;
  frameNumberAround: number;
  primaryMaterial: MongooseId;
  secondaryMaterial: MongooseId;
  finish: MongooseId;
  customer: MongooseId;
}
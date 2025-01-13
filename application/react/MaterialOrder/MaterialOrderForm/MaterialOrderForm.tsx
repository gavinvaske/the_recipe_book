import React, { useEffect, useState } from 'react';
import './MaterialOrderForm.scss'
import { useNavigate, useParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { MaterialOrder } from '../../../react/_types/databaseModels/materialOrder'
import { Input } from '../../_global/FormInputs/Input/Input';
import { Select, SelectOption } from '../../_global/FormInputs/Select/Select';
import { getMaterials } from '../../_queries/material';
import { Material } from '../../_types/databasemodels/material.ts';
import axios, { AxiosError, AxiosResponse } from 'axios';
import { getUsers } from '../../_queries/users';
import { User } from '../../_types/databasemodels/user.ts';
import { getVendors } from '../../_queries/vendors';
import { Vendor } from '../../_types/databasemodels/vendor.ts';
import { useErrorMessage } from '../../_hooks/useErrorMessage';
import { useSuccessMessage } from '../../_hooks/useSuccessMessage';
import { MongooseId } from '../../_types/typeAliases';
import { getOneMaterialOrder } from '../../_queries/materialOrder';
import { convertDateStringToFormInputDateString } from '../../_helperFunctions/dateTime';
import { IMaterialOrder } from '../../../api/models/materialOrder'

const materialOrderTableUrl = '/react-ui/tables/material-order'

export const MaterialOrderForm = () => {
  const { register, handleSubmit, formState: { errors }, reset } = useForm<MaterialOrderFormAttributes>({
    defaultValues: {
      freightCharge: 0,
      fuelCharge: 0
    }
  });
  const navigate = useNavigate();
  const { mongooseId } = useParams();
  const [users, setUsers] = useState<SelectOption[]>([])
  const [materials, setMaterials] = useState<SelectOption[]>([])
  const [vendors, setVendors] = useState<SelectOption[]>([])

  const isUpdateRequest = mongooseId && mongooseId.length > 0;

  const preloadFormData = async () => {
    const materials = await getMaterials();
    const users = await getUsers();
    const vendors = await getVendors();

    setMaterials(materials.map((material: Material) => {
      return {
        displayName: material.name,
        value: material._id
      }
    }))
    setUsers(users.map((user: User) => {
      return {
        displayName: user.email,
        value: user._id
      }
    }))
    setVendors(vendors.map((vendor: Vendor) => {
      return {
        displayName: vendor.name,
        value: vendor._id
      }
    }))

    // The code below deals with populating the fields on the form if a user has selected "edit" on an existing object
    if (!isUpdateRequest) return;

    const materialOrder: IMaterialOrder = await getOneMaterialOrder(mongooseId)

    const formValues: MaterialOrderFormAttributes = {
      author: materialOrder.author,
      material: materialOrder.material,
      vendor: materialOrder.vendor,
      purchaseOrderNumber: materialOrder.purchaseOrderNumber,
      orderDate: convertDateStringToFormInputDateString(materialOrder.orderDate as unknown as string),
      feetPerRoll: materialOrder.feetPerRoll,
      totalRolls: materialOrder.totalRolls,
      totalCost: materialOrder.totalCost,
      hasArrived: materialOrder.hasArrived,
      notes: materialOrder.notes,
      arrivalDate: convertDateStringToFormInputDateString(materialOrder.arrivalDate as unknown as string),
      freightCharge: materialOrder.freightCharge,
      fuelCharge: materialOrder.fuelCharge
    }

    reset(formValues) // Loads data into the form and forces a rerender
  }

  useEffect(() => {
    preloadFormData()
      .catch((error) => {
        navigate(materialOrderTableUrl)
        useErrorMessage(error)
      })
  }, [])

  const onSubmit = (formData: MaterialOrderFormAttributes) => {
    if (isUpdateRequest) {
      axios.patch(`/material-orders/${mongooseId}`, formData)
        .then((_) => {
          navigate(materialOrderTableUrl)
          useSuccessMessage('Update was successful')
        })
        .catch((error: AxiosError) => useErrorMessage(error));
    } else {
      axios.post('/material-orders', formData)
      .then((_: AxiosResponse) => {
        navigate(materialOrderTableUrl);
        useSuccessMessage('Creation was successful')
      })
      .catch((error: AxiosError) => useErrorMessage(error))
    }
  }

  return (
    <div id='material-po-form-page-wrapper' className='page-wrapper'>
      <div className='card'>
        <div className='form-card-header'>
          <h3>Create Material Order</h3>
        </div>
        <div className='form-wrapper'>
          <form onSubmit={handleSubmit(onSubmit)} data-test='material-order-form'>
            <Select 
              attribute='author'
              label="Author"
              options={users}
              register={register}
              isRequired={true}
              errors={errors}
            />
            <Select 
              attribute='material'
              label="Material"
              options={materials}
              register={register}
              isRequired={true}
              errors={errors}
            />
            <Select 
              attribute='vendor'
              label="Vendors"
              options={vendors}
              register={register}
              isRequired={true}
              errors={errors}
            />
            <Input
                attribute='purchaseOrderNumber'
                label="Purchase Order Number"
                register={register}
                isRequired={true}
                errors={errors}
            />
            <Input
                attribute='orderDate'
                label="Order Date"
                register={register}
                isRequired={true}
                errors={errors}
                fieldType='date'
            />
            <Input
                attribute='feetPerRoll'
                label="Feet per Roll"
                register={register}
                isRequired={true}
                errors={errors}
            />
            <Input
                attribute='totalRolls'
                label="Total Rolls"
                register={register}
                isRequired={true}
                errors={errors}
            />
            <Input
                attribute='totalCost'
                label="Total Cost"
                register={register}
                isRequired={true}
                errors={errors}
            />
            <Input
                attribute='hasArrived'
                label="Has Arrived"
                register={register}
                isRequired={false}
                errors={errors}
                fieldType='checkbox'
            />
            <Input
                attribute='notes'
                label="Notes"
                register={register}
                isRequired={false}
                errors={errors}
            />
            <Input
                attribute='arrivalDate'
                label="Arrival Date"
                register={register}
                isRequired={true}
                errors={errors}
                fieldType='date'
            />
            <Input
                attribute='freightCharge'
                label="Freight Charge"
                register={register}
                isRequired={true}
                errors={errors}
            />
            <Input
                attribute='fuelCharge'
                label="Fuel Charge"
                register={register}
                isRequired={true}
                errors={errors}
            />
            <button className='create-entry submit-button' type='submit'>{isUpdateRequest ? 'Update' : 'Create'}</button>
          </form>
        </div>
      </div>
    </div>
  )
}

type MaterialOrderFormAttributes = {
  author: MongooseId;
  material: MongooseId;
  vendor: MongooseId;
  purchaseOrderNumber: string;
  orderDate: string;
  feetPerRoll: number;
  totalRolls: number;
  totalCost: number;
  hasArrived?: boolean;
  notes?: string;
  arrivalDate: string;
  freightCharge: number;
  fuelCharge: number;
}
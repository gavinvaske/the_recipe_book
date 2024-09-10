import React, { useEffect } from 'react';
import './DieForm.scss';
import { Input } from '../../_global/FormInputs/Input/Input';
import { useForm } from 'react-hook-form';
import { useNavigate, useParams } from 'react-router-dom';
import axios, { AxiosError, AxiosResponse } from 'axios';
import { useSuccessMessage } from '../../_hooks/useSuccessMessage';
import { useErrorMessage } from '../../_hooks/useErrorMessage';
import { getOneDie } from '../../_queries/die';
import { convertDateStringToFormInputDateString } from '../../_helperFunctions/dateTime';
import { Select } from '../../_global/FormInputs/Select/Select';
import { dieShapes } from '../../../api/enums/dieShapesEnum';
import { toolTypes } from '../../../api/enums/toolTypesEnum';
import { dieVendors } from '../../../api/enums/dieVendorsEnum';
import { dieMagCylinders } from '../../../api/enums/dieMagCylindersEnum';
import { dieStatuses } from '../../../api/enums/dieStatusesEnum';

const dieTableUrl = '/react-ui/tables/die'

export const DieForm = () => {
  const navigate = useNavigate();
  const { mongooseId } = useParams();
  const isUpdateRequest = mongooseId && mongooseId.length > 0;

  const { register, handleSubmit, formState: { errors }, reset } = useForm<DieFormAttributes>();

  useEffect(() => {
    preloadFormData()
      .catch((error) => {
        useErrorMessage(error)
      })
  }, [])

  const preloadFormData = async () => {
    if (!isUpdateRequest) return;

    const die = await getOneDie(mongooseId);

    const formValues: DieFormAttributes = {
      dieNumber: die.dieNumber,
      shape: die.shape,
      sizeAcross: die.sizeAcross,
      sizeAround: die.sizeAround,
      numberAcross: die.numberAcross,
      numberAround: die.numberAround,
      gear: die.gear,
      toolType: die.toolType,
      notes: die.notes,
      cost: die.cost,
      vendor: die.vendor,
      magCylinder: die.magCylinder,
      cornerRadius: die.cornerRadius,
      topAndBottom: die.topAndBottom,
      leftAndRight: die.leftAndRight,
      spaceAcross: die.spaceAcross,
      spaceAround: die.spaceAround,
      facestock: die.facestock,
      liner: die.liner,
      specialType: die.specialType,
      serialNumber: die.serialNumber,
      status: die.status,
      quantity: die.quantity,
      orderDate: convertDateStringToFormInputDateString(die.orderDate as unknown as string),
      arrivalDate: convertDateStringToFormInputDateString(die.arrivalDate as unknown as string)
    }

    reset(formValues) // Loads data into the form and forces a rerender
  }

  const onSubmit = (formData: DieFormAttributes) => {
    if (isUpdateRequest) {
      axios.patch(`/dies/${mongooseId}`, formData)
        .then((_) => {
          navigate(dieTableUrl)
          useSuccessMessage('Update was successful')
        })
        .catch((error: AxiosError) => useErrorMessage(error));
    } else {
      axios.post('/dies', formData)
        .then((_: AxiosResponse) => {
          navigate(dieTableUrl);
          useSuccessMessage('Creation was successful')
        })
        .catch((error: AxiosError) => useErrorMessage(error))
    }
  }

  return (
    <div className='page-container'>
      <div className='form-card'>
        <div className='form-card-header'>
          <h1>{isUpdateRequest ? 'Update' : 'Create'} Die</h1>
        </div>
        <div className='form-wrapper'>
          <form onSubmit={handleSubmit(onSubmit)} data-test='die-form'>
            <Input
              attribute='dieNumber'
              label="Die Number"
              register={register}
              errors={errors}
              isRequired={true}
            />
            <Select
              attribute='shape'
              label='Shape'
              options={dieShapes.map((option) => ({ value: option, displayName: option }))}
              register={register}
              errors={errors}
              isRequired={true}
            />
            <Input
              attribute='sizeAcross'
              label="Size Across"
              register={register}
              errors={errors}
              isRequired={true}
            />
            <Input
              attribute='sizeAround'
              label="Size Around"
              register={register}
              errors={errors}
              isRequired={true}
            />
            <Input
              attribute='numberAcross'
              label="Number Across"
              register={register}
              errors={errors}
              isRequired={true}
            />
            <Input
              attribute='numberAround'
              label="Number Around"
              register={register}
              errors={errors}
              isRequired={true}
            />
            <Input
              attribute='gear'
              label="Gear"
              register={register}
              errors={errors}
              isRequired={true}
            />
            <Select
              attribute='toolType'
              label='Tool Type'
              options={toolTypes.map((option) => ({ value: option, displayName: option }))}
              register={register}
              errors={errors}
              isRequired={true}
            />
            <Input
              attribute='notes'
              label="Notes"
              register={register}
              errors={errors}
              isRequired={true}
            />
            <Input
              attribute='cost'
              label="Cost"
              register={register}
              errors={errors}
              isRequired={true}
            />
            <Select
              attribute='vendor'
              label='Vendor'
              options={dieVendors.map((option) => ({ value: option, displayName: option }))}
              register={register}
              errors={errors}
              isRequired={true}
            />
            <Select
              attribute='magCylinder'
              label='Magnetic Cylinder'
              options={dieMagCylinders.map((option) => ({ value: String(option), displayName: String(option) }))}
              register={register}
              errors={errors}
              isRequired={true}
            />
            <Input
              attribute='cornerRadius'
              label="Corner Radius"
              register={register}
              errors={errors}
              isRequired={true}
            />
            <Input
              attribute='topAndBottom'
              label="Top and Bottom"
              register={register}
              errors={errors}
              isRequired={true}
            />
            <Input
              attribute='leftAndRight'
              label="Left and Right"
              register={register}
              errors={errors}
              isRequired={true}
            />
            <Input
              attribute='spaceAcross'
              label="Space Across"
              register={register}
              errors={errors}
              isRequired={true}
            />
            <Input
              attribute='spaceAround'
              label="Space Around"
              register={register}
              errors={errors}
              isRequired={true}
            />
            <Input
              attribute='facestock'
              label="Facestock"
              register={register}
              errors={errors}
              isRequired={true}
            />
            <Input
              attribute='liner'
              label="Liner"
              register={register}
              errors={errors}
              isRequired={true}
            />
            <Input
              attribute='specialType'
              label="Special Type"
              register={register}
              errors={errors}
              isRequired={false}
            />
            <Input
              attribute='serialNumber'
              label="Serial Number"
              register={register}
              errors={errors}
              isRequired={true}
            />
            <Select
              attribute='status'
              label='Status'
              options={dieStatuses.map((option) => ({ value: option, displayName: option }))}
              register={register}
              errors={errors}
              isRequired={true}
            />
            <Input
              attribute='quantity'
              label="Quantity"
              register={register}
              errors={errors}
              isRequired={true}
              defaultValue='1'
            />
            <Input
              attribute='orderDate'
              label="Order Date"
              register={register}
              errors={errors}
              isRequired={false}
              fieldType='date'
            />
            <Input
              attribute='arrivalDate'
              label="Arrival Date"
              register={register}
              errors={errors}
              isRequired={false}
              fieldType='date'
            />
            <button className='create-entry submit-button' type='submit'>{isUpdateRequest ? 'Update' : 'Create'}</button>
          </form>
        </div>
      </div>
    </div>
  )
}

type DieFormAttributes = {
  dieNumber: string;
  shape: string;
  sizeAcross: number;
  sizeAround: number;
  numberAcross: number;
  numberAround: number;
  gear: number;
  toolType: string;
  notes: string;
  cost: number;
  vendor: string;
  magCylinder: number;
  cornerRadius: number;
  topAndBottom: number;
  leftAndRight: number;
  spaceAcross: number;
  spaceAround: number;
  facestock: string;
  liner: string;
  specialType?: string;
  serialNumber: string;
  status: string;
  quantity: number;
  orderDate?: string;
  arrivalDate?: string;
}
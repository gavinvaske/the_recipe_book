import React, { useEffect } from 'react';
import './DieForm.scss';
import { Input } from '../../_global/FormInputs/Input/Input';
import { useForm } from 'react-hook-form';
import { useNavigate, useParams } from 'react-router-dom';
import axios, { AxiosError, AxiosResponse } from 'axios';
import { useSuccessMessage } from '../../_hooks/useSuccessMessage';
import { useErrorMessage } from '../../_hooks/useErrorMessage';
import { getOneDie } from '../../_queries/die';
import { dieShapes } from '../../../api/enums/dieShapesEnum';
import { toolTypes } from '../../../api/enums/toolTypesEnum';
import { dieVendors } from '../../../api/enums/dieVendorsEnum';
import { dieMagCylinders } from '../../../api/enums/dieMagCylindersEnum';
import { dieStatuses } from '../../../api/enums/dieStatusesEnum';
import { CustomSelect } from '../../_global/FormInputs/CustomSelect/CustomSelect';
import { TextArea } from '../../_global/FormInputs/TextArea/TextArea';

const dieTableUrl = '/react-ui/tables/die'

export const DieForm = () => {
  const navigate = useNavigate();
  const { mongooseId } = useParams();
  const isUpdateRequest = mongooseId && mongooseId.length > 0;

  const { register, handleSubmit, formState: { errors }, reset, control } = useForm<DieFormAttributes>({
    defaultValues: {
      quantity: 1
    }
  });

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
      facestock: die.facestock,
      liner: die.liner,
      specialType: die.specialType || '',
      serialNumber: die.serialNumber,
      status: die.status,
      quantity: die.quantity
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
    <div id='die-form-page-wrapper' className='page-wrapper'>
      <div className='card'>
        <div className='form-card-header'>
          <h3>{isUpdateRequest ? 'Update' : 'Create'} Die</h3>
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
            <CustomSelect
              attribute='shape'
              label='Shape'
              options={dieShapes.map((option) => ({ value: option, displayName: option }))}
              register={register}
              errors={errors}
              isRequired={true}
              control={control}
            />
            <Input
              attribute='sizeAcross'
              label="Size Across"
              register={register}
              errors={errors}
              isRequired={true}
              unit='@storm'
            />
            <Input
              attribute='sizeAround'
              label="Size Around"
              register={register}
              errors={errors}
              isRequired={true}
              unit='@storm'
            />
            <Input
              attribute='numberAcross'
              label="Number Across"
              register={register}
              errors={errors}
              isRequired={true}
                unit='@storm'
            />
            <Input
              attribute='numberAround'
              label="Number Around"
              register={register}
              errors={errors}
              isRequired={true}
              unit='@storm'
            />
            <Input
              attribute='gear'
              label="Gear"
              register={register}
              errors={errors}
              isRequired={true}
            />
            <CustomSelect
              attribute='toolType'
              label='Tool Type'
              options={toolTypes.map((option) => ({ value: option, displayName: option }))}
              register={register}
              errors={errors}
              isRequired={true}
              control={control}
            />
            <TextArea
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
              fieldType='currency'
            />
            <CustomSelect
              attribute='vendor'
              label='Vendor'
              options={dieVendors.map((option) => ({ value: option, displayName: option }))}
              register={register}
              errors={errors}
              isRequired={true}
              control={control}
            />
            <CustomSelect
              attribute='magCylinder'
              label='Magnetic Cylinder'
              options={dieMagCylinders.map((option) => ({ value: String(option), displayName: String(option) }))}
              register={register}
              errors={errors}
              isRequired={true}
              control={control}
            />
            <Input
              attribute='cornerRadius'
              label="Corner Radius"
              register={register}
              errors={errors}
              isRequired={true}
              unit='@storm'
            />
            <Input
              attribute='topAndBottom'
              label="Top and Bottom"
              register={register}
              errors={errors}
              isRequired={true}
              unit='@storm'
            />
            <Input
              attribute='leftAndRight'
              label="Left and Right"
              register={register}
              errors={errors}
              isRequired={true}
              unit='@storm'
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
            <CustomSelect
              attribute='status'
              label='Status'
              options={dieStatuses.map((option) => ({ value: option, displayName: option }))}
              register={register}
              errors={errors}
              isRequired={true}
              control={control}
            />
            <Input
              attribute='quantity'
              label="Quantity"
              register={register}
              errors={errors}
              isRequired={true}
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
  facestock: string;
  liner: string;
  specialType?: string;
  serialNumber: string;
  status: string;
  quantity: number;
}
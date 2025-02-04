import React from 'react'
import './AddressListItem.scss'
import { IAddressForm } from '@ui/types/forms';

interface Props {
  onDelete: () => void;
  data: IAddressForm
}
const AddressListItem = (props: Props) => {
  const { data, onDelete } = props;
  const { name, street, unitOrSuite, city, state, zipCode } = data;
  return (
    <div className='address-card'>
        <div className='column-td'>{name}</div>
        <div className='column-td'>{street}</div>
        <div className='column-td'>{unitOrSuite}</div>
        <div className='column-td'>{city}</div>
        <div className='column-td'>{state}</div>
        <div className='column-td'>{zipCode}</div>

        <div className='column-td' onClick={onDelete}><i className="fa-regular fa-trash-can"></i></div>
    </div>
  )
}

export default AddressListItem;

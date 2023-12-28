import React from 'react'
import './AddressCard.scss'

const AddressCard = (props) => {
  const { data, onDelete } = props;
  const { name, street, unitOrSuite, city, state, zipCode } = data;
  return (
    <div className='address-card'>
        <p>Name: {name}</p>
        <p>Street: {street}</p>
        <p>Unit/Suite #: {unitOrSuite}</p>
        <p>City: {city}</p>
        <p>State: {state}</p>
        <p>Zip: {zipCode}</p>

        <div onClick={onDelete}>Click to Delete</div>
    </div>
  )
}

export default AddressCard;

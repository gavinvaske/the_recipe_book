import React from 'react'
import './ShippingLocationCard.scss'

const ShippingLocationCard = (props) => {
  const { data, onDelete } = props;
  const { freightAccountNumber, deliveryMethod, name, street, unitOrSuite, city, state, zipCode } = data;
  return (
    <div className='shipping-location-card'>
      <div className='column-td'>{freightAccountNumber}</div>
      <div className='column-td'>{deliveryMethod}</div>
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

export default ShippingLocationCard;

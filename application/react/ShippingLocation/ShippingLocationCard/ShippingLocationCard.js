import React from 'react'
import './ShippingLocationCard.scss'

const ShippingLocationCard = (props) => {
  const { data, onDelete } = props;
  const { freightAccountNumber, deliveryMethod, name, street, unitOrSuite, city, state, zipCode } = data;
  return (
    <div className='shipping-location-card'>
      <p>Freight Account Number: {freightAccountNumber}</p>
      <p>Delivery Method: {deliveryMethod}</p>
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

export default ShippingLocationCard;

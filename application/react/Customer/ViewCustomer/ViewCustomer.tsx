import React from 'react';
import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { getOneCustomer } from '../../_queries/customer';
import { useErrorMessage } from '../../_hooks/useErrorMessage';
import { ICustomer, IShippingLocation } from '../../../api/models/customer';
import { IAddress } from '../../../api/schemas/address'
import { IContact } from '../../../api/schemas/contact';

export const ViewCustomer = () => {
  const { mongooseId }= useParams();

  const { isError, data: customer, error } = useQuery<ICustomer>({
    queryKey: ['get-customer', mongooseId],
    queryFn: () => getOneCustomer(mongooseId as string),
    initialData: {} as ICustomer
  })

  if (isError) {
    useErrorMessage(error)
  }

  return (
    <div>
      <p>Customer ID: {customer.customerId}</p>
      <p>Name: {customer.name}</p>
      <p>Notes: {customer.notes}</p>
      
      <h3>Business Locations: </h3>
      {customer.businessLocations?.map((location: IAddress) => (<Address location={location}/>))}

      <h3>Shipping Locations: </h3>
      {customer.shippingLocations?.map((shippingLocation: IShippingLocation) => (<ShippingLocation shippingLocation={shippingLocation} />))}

      <h3>Contacts: </h3>
      {customer.contacts?.map((contact) => (<Contact contact={contact} />))}
    </div>
  )
}

type ContactProps = {
  contact: IContact
}

const Contact = (props: ContactProps) => {
  const { contact } = props;

  return (
    <div>
      <p>Full Name: {contact.fullName}</p>
      <p>Phone Number: {contact.phoneNumber}</p>
      <p>Phone Extension: {contact.phoneExtension}</p>
      <p>Email: {contact.email}</p>
      <p>Contact Status: {contact.contactStatus}</p>
      <p>Notes: {contact.notes}</p>
      <p>Position: {contact.position}</p>
      {contact.location && <Address location={contact.location} />}
    </div>
  )
}

type AddressProps = {
  location: IAddress
}

const Address = (props: AddressProps) => {
  const { location } = props;

  return (
    <div>
      <p>{location.name}</p>
      <p>{location.street}</p>
      <p>{location.unitOrSuite}</p>
      <p>{location.city}</p>
      <p>{location.state}</p>
      <p>{location.zipCode}</p>
    </div>
  )
}

type ShippingLocationProps = {
  shippingLocation: IShippingLocation
}

const ShippingLocation = (props: ShippingLocationProps) => {
  const { shippingLocation } = props;

  return (
    <div>
      <p>Freight Account Number: {shippingLocation.freightAccountNumber}</p>
      <p>Delivery Method: {shippingLocation.deliveryMethod as unknown as string}</p>
      <p>Name: {shippingLocation.name}</p>
      <p>Street: {shippingLocation.street}</p>
      <p>Unit or Suite: {shippingLocation.unitOrSuite}</p>
      <p>City: {shippingLocation.city}</p>
      <p>State: {shippingLocation.state}</p>
      <p>Zip Code: {shippingLocation.zipCode}</p>
    </div>
  )
}
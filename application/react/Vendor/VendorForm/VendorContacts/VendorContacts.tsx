import React from 'react'
import './VendorContacts.scss'
import { VendorContactFormValues } from '../VendorContactForm/VendorContactForm'
import { removeElementFromArray } from '../../../utils/state-service'

interface Props {
  contacts: VendorContactFormValues[],
  setContacts: (contacts: VendorContactFormValues[]) => void,
}
export const VendorContacts = (props: Props) => {
  const { contacts, setContacts } = props

  return (
    <>
      <div className='title-header'>
        <h3>Contacts:</h3>
      </div>
      <div id='contact-cards' className='tbl-pri'>
        <div className='tbl-hdr'>
          <div className='tbl-cell'>Name</div>
          <div className='tbl-cell'>Freight Number</div>
          <div className='tbl-cell'>Delivery Method</div>
          <div className='tbl-cell'>Street</div>
          <div className='tbl-cell'>Unit</div>
          <div className='tbl-cell'>City</div>
          <div className='tbl-cell'>State</div>
          <div className='tbl-cell'>Zip</div>
          <div className='tbl-cell'>Delete</div>
        </div>
        <div className='table'>
          {
            contacts.map((contact, index) => {
              return (
                <div key={index}>
                  <div className='contact-card'>
                    <p>Full Name: {contact.fullName}</p>
                    <p>Phone Number: {contact.phoneNumber}</p>
                    <p>Phone Extension: {contact.phoneExtension}</p>
                    <p>Email: {contact.email}</p>
                    <p>Contact Status: {contact.contactStatus}</p>
                    <p>Notes: {contact.notes}</p>
                    <p>Position: {contact.position}</p>
                    <p>Location: {JSON.stringify(location)}</p>

                    <button onClick={() => removeElementFromArray(index, contacts, setContacts)}>Click to Delete</button>
                  </div>
                </div>
              )
            })
          }
        </div>
      </div>
    </>
  )
}
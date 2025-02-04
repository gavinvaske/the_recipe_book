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
          <div className='tbl-cell'>Cell Phone</div>
          <div className='tbl-cell'>Work Phone</div>
          <div className='tbl-cell'>Ext.</div>
          <div className='tbl-cell'>Title</div>
          <div className='tbl-cell'>Email</div>
          <div className='tbl-cell'>Notes</div>
        </div>
        <div className='table'>
          {
            contacts.map((contact, index) => {
              return (
                <div key={index}>
                  <div className='contact-card'>
                    <p>Full Name: {contact.fullName}</p>
                    <p>Phone Number: {contact.cellPhone}</p>
                    <p>Phone Extension: {contact.workPhone}</p>
                    <p>Email: {contact.ext}</p>
                    <p>Contact Status: {contact.title}</p>
                    <p>Notes: {contact.email}</p>
                    <p>Position: {contact.notes}</p>

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
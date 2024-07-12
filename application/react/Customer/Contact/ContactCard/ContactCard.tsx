import React from 'react';
import './ContactCard.scss';
import { ContactFormAttributes } from '../../../_types/forms/contact'

type Props = {
  data: ContactFormAttributes,
  onDelete: () => void
}

const ContactCard = (props: Props) => {
  const { data, onDelete } = props;
  const {
    fullName, phoneNumber, phoneExtension, email, 
    contactStatus, notes, position, location
  } = data;
  
  return (
    <div className='contact-card'>
      <p>Full Name: {fullName}</p>
      <p>Phone Number: {phoneNumber}</p>
      <p>Phone Extension: {phoneExtension}</p>
      <p>Email: {email}</p>
      <p>Contact Status: {contactStatus}</p>
      <p>Notes: {notes}</p>
      <p>Position: {position}</p>
      <p>Location: {JSON.stringify(location)}</p>

      <button onClick={() => onDelete()}>Click to Delete</button>
    </div>
  )
}

export default ContactCard;
import React from 'react';
import './ContactCard.scss';

const ContactCard = (props) => {
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

      <button onClick={() => onDelete(data)}>Click to Delete</button>
    </div>
  )
}

export default ContactCard;
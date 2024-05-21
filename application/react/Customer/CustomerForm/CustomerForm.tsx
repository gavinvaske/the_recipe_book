import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './CustomerForm.scss'
import { useForm } from 'react-hook-form';
import ErrorMessage from '../../_global/FormInputErrorMessage/FormInputErrorMessage';
import ShippingLocationForm from '../../ShippingLocation/ShippingLocationForm/ShippingLocationForm';
import { FormModal } from '../../_global/FormModal/FormModal';
import AddressForm from '../../Address/AddressForm/AddressForm';
import AddressCard from '../../Address/AddressCard/AddressCard';
import ShippingLocationCard from '../../ShippingLocation/ShippingLocationCard/ShippingLocationCard';
import { removeElementFromArray } from '../../utils/state-service';
import ContactForm from '../Contact/ContactForm/ContactForm';
import ContactCard from '../Contact/ContactCard/ContactCard';

import { AddressForm as AddressFormType } from '../../_types/forms/address';
import { ShippingLocationForm as ShippingLocationFormType } from '../../_types/forms/shippingLocation';
import { ContactForm as ContactFormType } from '../../_types/forms/contact';
import { CustomerForm as CustomerFormType } from '../../_types/forms/customer';

import { CreditTerm } from '../../_types/databaseModels/creditTerm';

const CustomerForm = () => {
  const { register, handleSubmit, formState: { errors } } = useForm<CustomerFormType>();

  const [showBillingLocationForm, setShowBillingLocationForm] = useState(false);
  const [showShippingLocationForm, setShowShippingLocationForm] = useState(false);
  const [showBusinessLocationForm, setShowBusinessLocationForm] = useState(false);
  const [showContactForm, setShowContactForm] = useState(false);
  const [creditTerms, setCreditTerms] = useState<CreditTerm[]>([])

  const [shippingLocations, setShippingLocations] = useState<ShippingLocationFormType[]>([])
  const [billingLocations, setBillingLocations] = useState<AddressFormType[]>([])
  const [businessLocations, setBusinessLocations] = useState<AddressFormType[]>([])
  const [locations, setLocations] = useState<(AddressFormType | ShippingLocationFormType)[]>([])
  const [contacts, setContacts] = useState<ContactFormType[]>([])

  useEffect(() => {
    setLocations([
      ...billingLocations,
      ...shippingLocations,
      ...businessLocations,
    ])
  }, [billingLocations, shippingLocations, businessLocations]);

  useEffect(() => {
    axios.get('/credit-terms')
      .then(({data}) => setCreditTerms(data))
      .catch((error) => alert('Error getting credit terms: ' + error.message));
  }, []);

  const onCustomerFormSubmit = (customer: CustomerFormType) => {
    customer.businessLocations = businessLocations;
    customer.shippingLocations = shippingLocations;
    customer.contacts = contacts;
    console.log(customer);

    axios.post('/customers', customer)
      .then(({data}) => {
        alert('Customer created successfully! (TODO: Redirect to customer table)')
      })
      .catch(({response}) => alert('Error creating customer: ' + response.data));
  };

  const hideBillingLocationForm = () => setShowBillingLocationForm(false);
  const hideShippingLocationForm = () => setShowShippingLocationForm(false);
  const hideBusinessLocationForm = () => setShowBusinessLocationForm(false);
  const hideContactForm = () => setShowContactForm(false);

  const onBillingLocationFormSubmit = (billingLocation: AddressFormType) => {
    hideBillingLocationForm();
    setBillingLocations([...billingLocations, billingLocation]);
  };

  const onShippingLocationFormSubmit = (shippingLocation: ShippingLocationFormType) => {
    hideShippingLocationForm();
    setShippingLocations([...shippingLocations, shippingLocation]);
  };

  const onBusinessLocationFormSubmit = (businessLocation: AddressFormType) => {
    hideBusinessLocationForm();
    setBusinessLocations([...businessLocations, businessLocation]);
  };

  const onContactFormSubmit = (contact: any) => {
    hideContactForm();
    const contactForm: ContactFormType = {
      ...contact,
      location: locations[contact.location]
    }
    setContacts([...contacts, contactForm]);
  }

  return (
    <div id='customer-form'>
      <form onSubmit={handleSubmit(onCustomerFormSubmit)}>
        <div>
          <label>Customer ID*:</label>
          <input type="text" {...register('customerId', { required: "This is required" })} />
          <ErrorMessage errors={errors} name="customerId" />
        </div>

        <div>
          <label>Name*:</label>
          <input type="text" {...register('name', { required: "This is required" })} />
          <ErrorMessage errors={errors} name="name" />  
        </div>

        <div>
          <label>Notes</label>
          <input type="text" {...register('notes', { })} />
          <ErrorMessage errors={errors} name="notes" />
        </div>

        <div>
          <label>Overun*</label>
          <input type="text" {...register('overun', { required: "This is required" })} />
          <ErrorMessage errors={errors} name="overun" />
        </div>

        <div>
          <select {...register("creditTerms")} multiple>
            {
              creditTerms.map((creditTerm: CreditTerm) => {
                return (
                  <option key={creditTerm._id} value={creditTerm._id}>
                    {creditTerm.description}
                  </option>
                )
              })
            }
          </select>
        </div>

        <button className='btn-primary' type="submit">Create Customer</button>
      </form>

      <div>
        <button type="button" onClick={() => setShowBusinessLocationForm(true)}>Add Business Location</button>
        <button type="button" onClick={() => setShowShippingLocationForm(true)}>Add Shipping Location</button>
        <button type="button" onClick={() => setShowBillingLocationForm(true)}>Add Billing Location</button>
        <button type="button" onClick={() => setShowContactForm(true)}>Add Contact</button>
      </div>

      <h3>Business Locations:</h3>
      <div id='business-location-cards'>
        {
          businessLocations.map((businessLocation, index) => {
            return (
              <div key={index}>
                <AddressCard 
                  data={businessLocation} 
                  onDelete={() => removeElementFromArray(index, businessLocations, setBusinessLocations)}
                />
              </div>
            )
          })
        }
      </div>

      <h3>Shipping Locations:</h3>
      <div id='shipping-location-cards'>
        {
          shippingLocations.map((shippingLocation, index) => {
            return (
              <div key={index}>
                <ShippingLocationCard
                  data={shippingLocation} 
                  onDelete={() => removeElementFromArray(index, shippingLocations, setShippingLocations)} 
                />
              </div>
            )
          })
        }
      </div>

      <h3>Billing Locations:</h3>
      <div id='billing-location-cards'>
        {
          billingLocations.map((billingLocation, index) => {
            return (
              <div key={index}>
                <AddressCard 
                  data={billingLocation} 
                  onDelete={() => removeElementFromArray(index, billingLocations, setBillingLocations)}
                />
              </div>
            )
          })
        }
      </div>

      <h3>Contacts:</h3>
      <div id='contact-cards'>
        {
          contacts.map((contact, index) => {
            return (
              <div key={index}>
                <ContactCard 
                  data={contact} 
                  onDelete={() => removeElementFromArray(index, contacts, setContacts)}
                />
              </div>
            )
          })
        }
      </div>

      {/* Code Below Renders a modal IFF user initiated one to open */}
      {
        showBillingLocationForm &&
        <FormModal
          Form={AddressForm}
          onSubmit={onBillingLocationFormSubmit}
          onCancel={hideBillingLocationForm}
        />
      }
      {
        showShippingLocationForm &&
        <FormModal
          Form={ShippingLocationForm}
          onSubmit={onShippingLocationFormSubmit}
          onCancel={hideShippingLocationForm}
        />
      }
      {
        showBusinessLocationForm &&
        <FormModal
          Form={AddressForm}
          onSubmit={onBusinessLocationFormSubmit}
          onCancel={hideBusinessLocationForm}
        />
      }
      {
        showContactForm &&
        <FormModal
          Form={ContactForm}
          onSubmit={onContactFormSubmit}
          onCancel={hideContactForm}
          locations={locations}
        />
      }
    </div>
  );
}

export default CustomerForm;
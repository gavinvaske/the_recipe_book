import React, { useState, useEffect } from 'react';
import axios, { AxiosError, AxiosResponse } from 'axios';
import './CustomerForm.scss'
import { useForm } from 'react-hook-form';
import { ShippingLocationForm, ShippingLocationFormAttributes } from '../../ShippingLocation/ShippingLocationForm/ShippingLocationForm';
import { FormModal } from '../../_global/FormModal/FormModal';
import { AddressForm } from '../../Address/AddressForm/AddressForm';
import AddressCard from '../../Address/AddressCard/AddressCard';
import { ContactForm } from '../Contact/ContactForm/ContactForm';
import ShippingLocationCard from '../../ShippingLocation/ShippingLocationCard/ShippingLocationCard';
import { removeElementFromArray } from '../../utils/state-service';
import ContactCard from '../Contact/ContactCard/ContactCard';

import { AddressFormAttributes } from '../../Address/AddressForm/AddressForm';
import { ContactFormAttributes } from '../Contact/ContactForm/ContactForm';

import { useNavigate, useParams } from 'react-router-dom';
import { Input } from '../../_global/FormInputs/Input/Input';
import { Select, SelectOption } from '../../_global/FormInputs/Select/Select';
import { useErrorMessage } from '../../_hooks/useErrorMessage';
import { useSuccessMessage } from '../../_hooks/useSuccessMessage';
import { getOneCustomer } from '../../_queries/customer';
import { MongooseId } from '../../_types/typeAliases';
import { getCreditTerms } from '../../_queries/creditTerm';
import { performTextSearch } from '../../_queries/_common';
import { ICreditTerm } from '@shared/types/models';
import { SearchResult } from '@shared/types/http';

const customerTableUrl = '/react-ui/tables/customer'

export const CustomerForm = () => {
  const { mongooseId } = useParams();
  const { register, handleSubmit, formState: { errors }, reset } = useForm<CustomerFormAttributes>();
  const navigate = useNavigate();

  const isUpdateRequest = mongooseId && mongooseId.length > 0;

  const [showBillingLocationForm, setShowBillingLocationForm] = useState(false);
  const [showShippingLocationForm, setShowShippingLocationForm] = useState(false);
  const [showBusinessLocationForm, setShowBusinessLocationForm] = useState(false);
  const [showContactForm, setShowContactForm] = useState(false);
  const [creditTerms, setCreditTerms] = useState<SelectOption[]>([])

  const [shippingLocations, setShippingLocations] = useState<ShippingLocationFormAttributes[]>([])
  const [billingLocations, setBillingLocations] = useState<AddressFormAttributes[]>([])
  const [businessLocations, setBusinessLocations] = useState<AddressFormAttributes[]>([])
  const [locations, setLocations] = useState<(AddressFormAttributes)[]>([])
  const [contacts, setContacts] = useState<ContactFormAttributes[]>([])

  useEffect(() => {
    setLocations([
      ...billingLocations,
      ...shippingLocations,
      ...businessLocations,
    ])
  }, [billingLocations, shippingLocations, businessLocations]);

  const preloadFormData = async () => {
    const creditTermSearchResults = await performTextSearch<ICreditTerm>('/credit-terms/search', { query: '', limit: '100' })
    const creditTerms = creditTermSearchResults.results
  
    setCreditTerms(creditTerms.map((creditTerm : ICreditTerm) => (
      {
        displayName: creditTerm.description,
        value: creditTerm._id as string
      }
    )))

    if (!isUpdateRequest) return;

    const customer = await getOneCustomer(mongooseId);

    const formValues: CustomerFormAttributes = {
      customerId: customer.customerId,
      name: customer.name,
      overun: customer.overun ? String(customer.overun) : '',
      notes: customer.notes || '',
      creditTerms: customer.creditTerms as MongooseId[]
    }

    reset(formValues) // Populates the form with loaded values

    setBusinessLocations(customer.businessLocations as AddressFormAttributes[])
    setBillingLocations(customer.billingLocations as AddressFormAttributes[])
    setShippingLocations(customer.shippingLocations as ShippingLocationFormAttributes[])
    setContacts(customer.contacts as unknown as ContactFormAttributes[])
  }

  useEffect(() => {
    preloadFormData()
      .catch((error) => {
        navigate(customerTableUrl)
        useErrorMessage(error)
      })
  }, [])

  const onCustomerFormSubmit = (customer: CustomerFormAttributes) => {
    customer.businessLocations = businessLocations;
    customer.shippingLocations = shippingLocations;
    customer.contacts = contacts;
    customer.billingLocations = billingLocations;

    if (isUpdateRequest) {
      axios.patch(`/customers/${mongooseId}`, customer)
        .then((_) => {
          navigate(customerTableUrl)
          useSuccessMessage('Update was successful')
        })
        .catch((error: AxiosError) => useErrorMessage(error));
    } else {
      axios.post('/customers', customer)
        .then((_ : AxiosResponse) => {
          navigate(customerTableUrl)
          useSuccessMessage('Creation was successful')
        })
        .catch((error: AxiosError) => useErrorMessage(error))
    }
  }


  const hideBillingLocationForm = () => setShowBillingLocationForm(false);
  const hideShippingLocationForm = () => setShowShippingLocationForm(false);
  const hideBusinessLocationForm = () => setShowBusinessLocationForm(false);
  const hideContactForm = () => setShowContactForm(false);

  const onBillingLocationFormSubmit = (billingLocation: AddressFormAttributes) => {
    hideBillingLocationForm();
    setBillingLocations([...billingLocations, billingLocation]);
  };

  const onShippingLocationFormSubmit = (shippingLocation: ShippingLocationFormAttributes) => {
    hideShippingLocationForm();
    setShippingLocations([...shippingLocations, shippingLocation]);
  };

  const onBusinessLocationFormSubmit = (businessLocation: AddressFormAttributes) => {
    hideBusinessLocationForm();
    setBusinessLocations([...businessLocations, businessLocation]);
  };

  const onContactFormSubmit = (contact: any) => {
    hideContactForm();
    const contactForm: ContactFormAttributes = {
      ...contact,
      location: locations[contact.location]
    }
    setContacts([...contacts, contactForm]);
  }

  return (
    <div id='customer-form-page-wrapper' className='page-wrapper'>
      <div className='card'>
        <div className='form-card-header'>
          <h3>{isUpdateRequest ? 'Update' : 'Create'} Customer</h3>
        </div>
        <div className='form-wrapper'>
          <form onSubmit={handleSubmit(onCustomerFormSubmit)} data-test='customer-form'>
            <div className='form-elements-wrapper'>
              <div className='group-field-wrapper'>
                <div className='triple-column-container'>
                  <Input
                      attribute='customerId'
                      label="Customer ID"
                      register={register}
                      isRequired={true}
                      errors={errors}
                  />
                  <Input
                    attribute='name'
                    label="Name"
                    register={register}
                    isRequired={true}
                    errors={errors}
                  />
                  <Input
                    attribute='overun'
                    label="Overun"
                    register={register}
                    isRequired={true}
                    errors={errors}
                  />
                </div>
                <Input
                    attribute='notes'
                    label="Notes"
                    register={register}
                    isRequired={false}
                    errors={errors}
                  />
                <Select
                  attribute='creditTerms'
                  label="Credit Term"
                  options={creditTerms}
                  register={register}
                  isRequired={false}
                  errors={errors}
                />
              </div>
            </div>
            <h3>Business Locations:</h3>
            <div id='business-location-cards'>
              <div className='table-header'>
                <div className='column-title'>Name</div>
                <div className='column-title'>Address</div>
                <div className='column-title'>Unit #</div>
                <div className='column-title'>City</div>
                <div className='column-title'>State</div>
                <div className='column-title'>Zip</div>
                <div className='column-title'>Delete</div>
              </div>
              <div className='table'>
                {
                  businessLocations.map((businessLocation, index) => {
                    return (
                      <div className='table-row' key={index}>
                        <AddressCard 
                          data={businessLocation} 
                          onDelete={() => removeElementFromArray(index, businessLocations, setBusinessLocations)}
                        />
                      </div>
                    )
                  })
                }
              </div>
            </div>
            <button className='add-new-row' type="button" onClick={() => setShowBusinessLocationForm(true)}><i className="fa-solid fa-plus"></i> Add Business Location</button>

            <h3>Shipping Locations:</h3>
            <div id='shipping-location-cards'>
              <div className='table-header'>
                  <div className='column-title'>Freight Acct #:</div>
                  <div className='column-title'>Delivery Method</div>
                  <div className='column-title'>Name</div>
                  <div className='column-title'>Street</div>
                  <div className='column-title'>Unit</div>
                  <div className='column-title'>City</div>
                  <div className='column-title'>State</div>
                  <div className='column-title'>Zip</div>
                  <div className='column-title'>Delete</div>
                </div>
              <div className='table'>
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
            </div>
            <button className='add-new-row' type="button" onClick={() => setShowShippingLocationForm(true)}><i className="fa-solid fa-plus"></i>Add Shipping Location</button>

            <h3>Billing Locations:</h3>
            <div id='billing-location-cards'>
            <div className='table-header'>
                  <div className='column-title'>Name</div>
                  <div className='column-title'>Street</div>
                  <div className='column-title'>Unit</div>
                  <div className='column-title'>City</div>
                  <div className='column-title'>State</div>
                  <div className='column-title'>Zip</div>
                  <div className='column-title'>Delete</div>
                </div>
              <div className='table'>
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
            </div>
            <button className='add-new-row' type="button" onClick={() => setShowBillingLocationForm(true)}><i className="fa-solid fa-plus"></i> Add Billing Location</button>

            <h3>Contacts:</h3>
            <div id='contact-cards'>
              <div className='table-header'>
                <div className='column-title'>Name</div>
                <div className='column-title'>Freight Number</div>
                <div className='column-title'>Delivery Method</div>
                <div className='column-title'>Street</div>
                <div className='column-title'>Unit</div>
                <div className='column-title'>City</div>
                <div className='column-title'>State</div>
                <div className='column-title'>Zip</div>
                <div className='column-title'>Delete</div>
              </div>
              <div className='table'>
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
            </div>
            <button className='add-new-row' type="button" onClick={() => setShowContactForm(true)}><i className="fa-solid fa-plus"></i> Add Contact</button>
            <button className='btn-primary' type="submit">{isUpdateRequest ? 'Update' : 'Create'}</button>
          </form>
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
    </div>
  );
}

export type CustomerFormAttributes = {
  customerId: string,
  name: string,
  businessLocations?: AddressFormAttributes[],
  shippingLocations?: ShippingLocationFormAttributes[],
  billingLocations?: AddressFormAttributes[],
  contacts?: ContactFormAttributes[],
  overun: string,
  notes?: string,
  creditTerms?: MongooseId[]
}
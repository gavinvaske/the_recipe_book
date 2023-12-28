import React, { useState } from 'react';
import './CustomerForm.scss'
import { useForm } from 'react-hook-form';
import ErrorMessage from '../../_global/FormInputErrorMessage/FormInputErrorMessage';
import ShippingLocationForm from '../../ShippingLocation/ShippingLocationForm/ShippingLocationForm';
import { FormModal } from '../../_global/FormModal/FormModal';
import AddressForm from '../../Address/AddressForm/AddressForm';
import AddressCard from '../../Address/AddressCard/AddressCard';
import ShippingLocationCard from '../../ShippingLocation/ShippingLocationCard/ShippingLocationCard';
import { removeElementFromArray } from '../../utils/state-service';

const CustomerForm = () => {
  const { register, handleSubmit, formState: { errors } } = useForm();

  const [showBillingLocationForm, setShowBillingLocationForm] = useState(false);
  const [showShippingLocationForm, setShowShippingLocationForm] = useState(false);
  const [showBusinessLocationForm, setShowBusinessLocationForm] = useState(false);

  const [billingLocations, setBillingLocations] = useState([]);
  const [shippingLocations, setShippingLocations] = useState([]);
  const [businessLocations, setBusinessLocations] = useState([]);

  const onCustomerFormSubmit = (data) => {
    alert('you submitted the form:' + data)
    console.log(data);
  };

  const hideBillingLocationForm = () => setShowBillingLocationForm(false);
  const hideShippingLocationForm = () => setShowShippingLocationForm(false);
  const hideBusinessLocationForm = () => setShowBusinessLocationForm(false);

  const onBillingLocationFormSubmit = (address) => {
    hideBillingLocationForm();
    alert('you submitted the address form: ' + JSON.stringify(address))
    setBillingLocations([...billingLocations, address]);
  };

  const onShippingLocationFormSubmit = (shippingLocation) => {
    hideShippingLocationForm();
    alert('you submitted the shipping location form: '+ JSON.stringify(shippingLocation))
    setShippingLocations([...billingLocations, shippingLocation]);
  };

  const onBusinessLocationFormSubmit = (businessLocation) => {
    hideBusinessLocationForm();
    alert('you submitted the business location form: ' + JSON.stringify(businessLocation))
    setBusinessLocations([...businessLocations, businessLocation]);
  };

  return (
    <div id='customer-form'>
      <form onSubmit={handleSubmit(onCustomerFormSubmit)}>
        <label>Customer ID*:</label>
        <input type="text" {...register('customerId', { required: "This is required" })} />
        <ErrorMessage errors={errors} name="customerId" />

        <label>Full Name*:</label>
        <input type="text" {...register('name', { required: "This is required" })} />
        <ErrorMessage errors={errors} name="name" />

        <label>Notes</label>
        <input type="text" {...register('notes', { })} />
        <ErrorMessage errors={errors} name="notes" />

        <label>Overun</label>
        <input type="text" {...register('overun', { })} />
        <ErrorMessage errors={errors} name="overun" />

        <button type="submit">Submit</button>
      </form>

      <div>
        <button type="button" onClick={() => setShowBusinessLocationForm(true)}>Add Business Location</button>
        <button type="button" onClick={() => setShowShippingLocationForm(true)}>Add Shipping Location</button>
        <button type="button" onClick={() => setShowBillingLocationForm(true)}>Add Billing Location</button>
      </div>

      {/* Code Below Renders a modal if user initiated one to open */}
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

      Business Locations:
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

      Shipping Locations:
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

      Billing Locations:
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
    </div>
  );
}

export default CustomerForm;
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
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [showShippingLocationForm, setShowShippingLocationForm] = useState(false);
  const [addresses, setAddresses] = useState([]);
  const [shippingLocations, setShippingLocations] = useState([]);


  const onCustomerFormSubmit = (data) => {
    alert('you submitted the form:' + data)
    console.log(data);
  };

  const hideAddressForm = () => {
    setShowAddressForm(false);
  }
  
  const hideShippingLocationForm = () => {
    setShowShippingLocationForm(false);
  }

  const onAddressFormSubmit = (data) => {
    hideAddressForm(false);
    alert('you submitted the address form: ' + JSON.stringify(data))
    setAddresses([...addresses, data]);
  };

  const onShippingLocationFormSubmit = (data) => {
    hideShippingLocationForm(false);
    alert('you submitted the shipping location form:'+ JSON.stringify(data))
    setShippingLocations([...addresses, data]);
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
      <button type="button" onClick={() => setShowAddressForm(true)}>Add Address</button>
      <button type="button" onClick={() => setShowShippingLocationForm(true)}>Add Shipping Location</button>
      <div>
        {
          showAddressForm &&
          <FormModal
            Form={AddressForm}
            onSubmit={onAddressFormSubmit}
            onCancel={hideAddressForm}
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
      </div>

      Addresses:
      <div id='address-cards'>
        {
          addresses.map((address, index) => {
            return (
              <div key={index}>
                <AddressCard 
                  data={address} 
                  onDelete={() => removeElementFromArray(index, addresses, setAddresses)}
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
    </div>
  );
}

export default CustomerForm;
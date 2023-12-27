import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './DeliveryMethodTable.scss';

const DeliveryMethodTable = () => {
  const [deliveryMethods, setDeliveryMethods] = useState([]);
  
  useEffect(() => {
    axios.get('/delivery-methods?responseDataType=JSON')
     .then((response) => {
         const { data } = response;
         setDeliveryMethods(data);
      })
     .catch((error) => {
        alert('Error loading Delivery Methods:', error);
      })
  }, [])

  return (
    <div id='delivery-method-table'>
      TODO: DeliveryMethodTable.js
      <br></br>
      <br></br>
      {
        deliveryMethods.map((deliveryMethod) => {
          return (
            <div key={deliveryMethod._id}>
              Name: {deliveryMethod.name}
            </div>
          )
        })
      }
    </div>
  )
};

export default DeliveryMethodTable;
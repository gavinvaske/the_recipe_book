import React, { useEffect } from 'react';
import axios from 'axios';
import './CreditTermsTable.scss'

const CreditTermsTable = () => {
  useEffect(() => {
    axios.get('/credit-terms?responseDataType=JSON')
      .then((response) => {
         const { data } = response;
         console.log(data)
      })
      .catch((error) => {
        alert('Error loading Credit Terms:', error);
      })
  }, [])
  return (
    <div id='credit-terms-table'>TODO: CreditTermsTable.js</div>
  )
};

export default CreditTermsTable;
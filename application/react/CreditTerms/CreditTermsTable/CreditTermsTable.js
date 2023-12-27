import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './CreditTermsTable.scss'

const CreditTermsTable = () => {
  const [creditTerms, setCreditTerms] = useState([]);

  useEffect(() => {
    axios.get('/credit-terms?responseDataType=JSON')
      .then((response) => {
         const { data } = response;
         setCreditTerms(data);
      })
      .catch((error) => {
        alert('Error loading Credit Terms:', error);
      })
  }, [])

  return (
    <div id='credit-terms-table'>
      TODO: CreditTermsTable.js
      <br></br>
      <br></br>
      {
        creditTerms.map((creditTerm) => {
          return (
            <div key={creditTerm._id}>
              Description: {creditTerm.description}
            </div>
          )
        })
      }
    </div>
  )
};

export default CreditTermsTable;
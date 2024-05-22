import React from 'react';
import './Material.scss'
import { observer } from 'mobx-react-lite';

function renderPurchaseOrders(material) {
  const {purchaseOrdersForMaterial} = material
  
  if (!purchaseOrdersForMaterial) return null;

  return (
    purchaseOrdersForMaterial.map((purchaseOrder) => (
      <div className='po-row'>
        <div className='po-col'>{purchaseOrder.purchaseOrderNumber || 'N/A'}</div>
        <div className='po-col'>{purchaseOrder.arrivalDate && purchaseOrder.arrivalDate.toLocaleString('en-US', {year: 'numeric', month: 'numeric', day: 'numeric', timeZone: 'UTC'}) || 'N/A'}</div>
        <div className='po-col'>{(purchaseOrder.feetPerRoll * purchaseOrder.totalRolls) || 'N/A'}</div>
      </div>
    ))
  )
}

const Material = observer((props: {material: any}) => {
  const { material } = props;

  return (
    <div className='card' id={material._id}>
    <div className='card-header flex-center-center-row'>
      <div className='col col-left'>
        <h2 className='material-id'>{material.materialId || 'N/A'}</h2>
      </div>
      <div className='col col-right'>
        <i className="fa-light fa-calendar"></i>
        <a href="/materials/update/<%= material._id %>"><i className="fa-regular fa-pen-to-square"></i></a>
      </div>

    </div>
    <div className='material-description text-left'>
        <span className='material-name'>{material.name || 'N/A'}</span>
    </div>
    <div className='actual-vs-ordered-container'>
      <div className='po-date-container'>
        <div className='po-list-header'>
          <div className='col col-one'>
            PO #
          </div>
          <div className='col col-two'>
            Arrival Date
          </div>
          <div className='col col-three'>
            Feet
          </div>
        </div>

        <div className='po-list-container'>
          {renderPurchaseOrders(material)}
        </div>

      </div>
      <div className='col col-left'>
        <span>Actual</span>
        <h2 className='material-length-in-stock'>{material.lengthOfMaterialInStock || 'N/A'}</h2>
      </div>
      <div className='divide-line'></div>
      <div className='col col-right'>
        <span>Ordered</span>
        <h2 className='material-length-ordered'>{material.lengthOfMaterialOrdered || 'N/A'}</h2>
      </div>
      <div className='divide-line'></div>
      <div className='col col-right'>
        <span>Net</span>
        <h2 className='material-length-ordered'>{material.netLengthOfMaterialInStock || 'N/A'}</h2>
      </div>
    </div>

  </div>
  ); 
});

export default Material;
import React from 'react';
import './Material.scss'
import { observer } from 'mobx-react-lite';
import { MaterialInventory } from '../../Inventory';
import { Material } from '../../../_types/databaseModels/material';

function renderPurchaseOrders(materialInventory: MaterialInventory) {
  const { purchaseOrdersForMaterial } = materialInventory

  if (!purchaseOrdersForMaterial) return null;

  return (
    purchaseOrdersForMaterial.map((purchaseOrder, index: number) => (
      <div className='po-row' key={index}>
        <div className='po-col'>{purchaseOrder.purchaseOrderNumber}</div>
        <div className='po-col'>{purchaseOrder.arrivalDate && purchaseOrder.arrivalDate.toLocaleString('en-US', { year: 'numeric', month: 'numeric', day: 'numeric', timeZone: 'UTC' })}</div>
        <div className='po-col'>{(purchaseOrder.feetPerRoll * purchaseOrder.totalRolls)}</div>
      </div>
    ))
  )
}

const Material = observer((props: { materialInventory: MaterialInventory }) => {
  const { materialInventory } = props;
  const material: Material = materialInventory.material;

  // socket.on(material._id, (material) => {
  //   // materialInventoryStore.recalculateInventoryForMaterial(material._id)
  //   // // TODO #1: Update the MaterialStore
  //   // // Example #1: MaterialStore.updateMaterial(material)
  //   // // Example #2: MaterialStore.materials[material._id] = material
  //   // setMaterial(material)
  //   // MaterialStore.updateMaterial(material)

  //   // console.log('Store AFTER setting state: ', MaterialStore.getMaterials())


  //   // TODO: #2?: I need to regenerate the MaterialInventory for this Material
  //   // Done in order to trigger the recalculation of: "Actual", "Ordered", and "Net"
  //   // I NEED to create an endpoint, such as "GET /material-inventory/:materialId"
  //   // Then store the response from this endpoint in the "MaterialInventoryStore"

  //   // TODO #3: Trigger a recalculation of the MaterialInventory attributes: 
  //   // 1) Feet On Hand
  //   // 2) Net Feet
  //   // 3) Feet On Order
  // });

  return (
    <div className='card' id={material._id}>
      <div className='card-header flex-center-center-row'>
        <div className='col col-left'>
          <h2 className='material-id'>{material.materialId}</h2>
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
            {renderPurchaseOrders(materialInventory)}
          </div>

        </div>
        <div className='col col-left'>
          <span>Actual</span>
          <h2 className='material-length-in-stock'>{materialInventory.lengthOfMaterialInStock}</h2>
        </div>
        <div className='divide-line'></div>
        <div className='col col-right'>
          <span>Ordered</span>
          <h2 className='material-length-ordered'>{materialInventory.lengthOfMaterialOrdered}</h2>
        </div>
        <div className='divide-line'></div>
        <div className='col col-right'>
          <span>Net</span>
          <h2 className='material-length-ordered'>{materialInventory.netLengthOfMaterialInStock}</h2>
        </div>
      </div>

    </div>
  );
});

export default Material;
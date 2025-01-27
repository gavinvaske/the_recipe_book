import React, { useState } from 'react';
import './Material.scss'
import { observer } from 'mobx-react-lite';
import { MaterialInventory } from '../../Inventory';
import { Modal } from '../../../_global/Modal/Modal';
import { Link } from 'react-router-dom';
import { getDayMonthYear } from '../../../_helperFunctions/dateTime';
import { IMaterial } from '@shared/types/models.ts';

function renderPurchaseOrders(materialInventory: MaterialInventory) {
  const { purchaseOrdersForMaterial } = materialInventory

  if (!purchaseOrdersForMaterial) return null;

  return (
    purchaseOrdersForMaterial.map((purchaseOrder, index: number) => (
      <div className='tb-row' key={index}>
        <div className='tb-cell cell-one'>
          <div className='pulse-indicator'></div>
          {purchaseOrder.purchaseOrderNumber}
        </div>
        <div className='tb-cell cell-two'>
          <div className='pulse-indicator'></div>
          {getDayMonthYear(purchaseOrder.orderDate)}
        </div>
        <div className='tb-cell cell-three'>
          <div className='pulse-indicator'></div>
          {getDayMonthYear(purchaseOrder.arrivalDate)}
        </div>
        <div className='tb-cell cell-four'>
          <div className='pulse-indicator'></div>
          {(purchaseOrder.feetPerRoll * purchaseOrder.totalRolls)}
        </div>
      </div>
    ))
  )
}


function renderPurchaseOrderContainer(materialInventory: MaterialInventory) {
  return (
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
  )
}

type Props = {
  materialInventory: MaterialInventory,
  onClick: () => void
}

const Material = observer((props: Props) => {
  const { materialInventory, onClick } = props;
  const material: IMaterial = materialInventory.material;
  const [shouldShowPoModal, setShouldShowPoModal] = useState(false);

  const showPurchaseOrderModal = (e) => {
    if (e.currentTarget.classList.contains('disabled')) {
      e.stopPropagation();
      return; // Prevent further execution if the class is present
    }
    setShouldShowPoModal(true)
    e.stopPropagation() // This is required to prevent any parents' onClick from being called
  };

  return (
    <div id={material._id} className={`card ${getLowInventoryClass(material.lowStockThreshold, material.lowStockBuffer, materialInventory)}`} onClick={() => onClick()} data-test='material-inventory-card'>
      <div className='card-header flex-center-center-row'>
        <div className='col col-left'>
          <h2 className='material-id'>{material.materialId}</h2>
          <div className='tooltip-top material-width-container'>
            <h2 className='material-width'>{material.width ? `${material.width}"` : 'N/A'}</h2>
            <span className='tooltiptext'>{material.width ? `${material.width}"` : 'N/A'} material width</span>
          </div>
        </div>
        <div className='col col-right'>
          <div className='material-card-options-container'>
            <div className={`material-option po-container tooltip-top ${materialInventory.purchaseOrdersForMaterial.length === 0 ? 'disabled' : 'enabled'}`} onClick={(e) => showPurchaseOrderModal(e)}>
              <span className='tooltiptext'>{materialInventory.purchaseOrdersForMaterial.length === 0 ? 'No purchase orders' : `View ${materialInventory.purchaseOrdersForMaterial.length} purchase orders`}</span>
              <div className='icon-container'>
                <div className='po-counter'>{materialInventory.purchaseOrdersForMaterial.length === 0 ? '0' : `${materialInventory.purchaseOrdersForMaterial.length}`}</div>
              </div>

              {
                shouldShowPoModal && 
                <PurchaseOrderModal material={material} materialInventory={materialInventory} onClose={() => setShouldShowPoModal(!shouldShowPoModal)}/>
              }

            </div>
            <div className='material-option open-ticket-container tooltip-top enabled'>
              <div className='icon-container'>
                <i className="fa-regular fa-memo"></i>
              </div>
              <span className='tooltiptext'>View open tickets</span>
            </div>
            <div className='material-option edit-container tooltip-top'>
              <Link to={`/react-ui/forms/material/${material._id}`}>
                <div className='icon-container'>
                  <i className="fa-regular fa-pen-to-square"></i>
                </div>
              </Link>
              <span className='tooltiptext'>Edit material details</span>
            </div>
          </div>
        </div>
      </div>
      <div className='material-description text-left'>
        <span className='material-name'>{material.name || 'N/A'}</span>
      </div>
      <div className='actual-vs-ordered-container'>

        {renderPurchaseOrderContainer(materialInventory)}

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
      <div className='material-location-container tooltip-top'>
        <span className='tooltiptext'>Location of material</span>
        <div className='span-wrapper'>
          <span className='material-location'>{material?.locations?.length > 0 ? material.locations.join(', ') : 'N/A'}</span>
        </div>
      </div>
    </div>
  );
});

type PurchaseOrderModalProps = {
  material: IMaterial, 
  materialInventory: MaterialInventory,
  onClose: () => void
}

const PurchaseOrderModal = (props: PurchaseOrderModalProps) => {
  const { material, materialInventory, onClose} = props;

  return (
    <Modal onClose={() => onClose()}>
      <div className='modal-content'>
        <div className='title-wrapper'>
          <h4>Purchase orders: {material.materialId}</h4>
        </div>
        <div className='purchase-order-info-wrapper'>
          <div className='po-table'>
            <div className='tb-header'>
              <div className='tb-cell cell-one'>
                <div className='pulse-indicator'></div>
                PO #
              </div>
              <div className='tb-cell cell-two'>
                Order Date
              </div>
              <div className='tb-cell cell-three'>
                Arrival Date
              </div>
              <div className='tb-cell cell-four'>
                Total Feet
              </div>
            </div>
            {renderPurchaseOrders(materialInventory)}
          </div>
        </div>
      </div>
    </Modal>
  )
}

function getLowInventoryClass(lowStockThreshold: number | undefined, lowStockBuffer: number | undefined, materialInventory: MaterialInventory): string {
  if (!lowStockThreshold || !lowStockBuffer) return 'low-inventory';

  if (materialInventory.netLengthOfMaterialInStock < lowStockThreshold) {
    return 'low-inventory';
  }

  if (materialInventory.netLengthOfMaterialInStock < lowStockThreshold + lowStockBuffer) {
    return 'low-inventory-warning';
  }

  return '';
}

export default Material;
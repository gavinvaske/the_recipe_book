import React, { useState } from 'react';
import './Material.scss'
import { observer } from 'mobx-react-lite';
import { MaterialInventory } from '../../Inventory';
import { Material } from '../../../_types/databasemodels/material.ts';
import { Modal } from '../../../_global/Modal/Modal';
import { Link } from 'react-router-dom';
import { getDayMonthYear } from '../../../_helperFunctions/dateTime';

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
  const material: Material = materialInventory.material;
  const [shouldShowPoModal, setShouldShowPoModal] = useState(false);

  const showPurchaseOrderModal = (e) => {
    setShouldShowPoModal(true)
    e.stopPropagation() // This is required to prevent any parents' onClick from being called
  }

  return (
    <div className='card' id={material._id} onClick={() => onClick()} data-test='material-inventory-card'>
      <div className='card-header flex-center-center-row'>
        <div className='col col-left'>
          <h2 className='material-id'>{material.materialId}</h2>
        </div>
        <div className='col col-right'>
          <div className='po-container'>
            <i className="fa-light fa-calendar" onClick={(e) => showPurchaseOrderModal(e)}></i>

            {
              shouldShowPoModal && 
              <PurchaseOrderModal material={material} materialInventory={materialInventory} onClose={() => setShouldShowPoModal(!shouldShowPoModal)}/>
            }

          </div>
          <Link to={`/react-ui/forms/material/${material._id}`}><i className="fa-regular fa-pen-to-square"></i></Link>
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

    </div>
  );
});

type PurchaseOrderModalProps = {
  material: Material, 
  materialInventory: MaterialInventory,
  onClose: () => void
}

const PurchaseOrderModal = (props: PurchaseOrderModalProps) => {
  const { material, materialInventory, onClose} = props;

  return (
    <Modal onClose={() => onClose()}>
      <div className='left'>
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
      <div className='right'>
        left panel for storm to do something neat
      </div>
    </Modal>
  )
}

export default Material;
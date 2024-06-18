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
      <div className='tb-row' key={index}>
        <div className='tb-cell cell-one'>
          <div class='pulse-indicator'></div>
          {purchaseOrder.purchaseOrderNumber}
        </div>
        <div className='tb-cell cell-two'>
          <div class='pulse-indicator'></div>
          {purchaseOrder.orderDate && purchaseOrder.orderDate.toLocaleString('en-US', { year: 'numeric', month: 'numeric', day: 'numeric'})}
        </div>
        <div className='tb-cell cell-three'>
          <div class='pulse-indicator'></div>
          {purchaseOrder.arrivalDate && purchaseOrder.arrivalDate.toLocaleString('en-US', { year: 'numeric', month: 'numeric', day: 'numeric'})}
        </div>
        <div className='tb-cell cell-four'>
          <div class='pulse-indicator'></div>
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

const togglePurchaseOrders = (e) => {
  // Add active class to the current button (highlight it)
  var elems = document.querySelectorAll("modal-active");
  var clickElement = e.target;  // get the dom element clicked.
  var clickElementParent = clickElement.parentElement;
  var elementClassName = clickElementParent.classList.contains("modal-active");  // get the classname of the clicked element's class name
  if(elementClassName){
      clickElementParent.classList.remove('modal-active')
  } else {
      clickElementParent.classList.add('modal-active')
      console.log("hello mars");
  }
}
// When the user clicks on (x), close the modal
function closeModal() {
  let activeModal = document.querySelector('.po-container.modal-active');
  activeModal.classList.remove('modal-active');
}


const Material = observer((props: { materialInventory: MaterialInventory }) => {
  const { materialInventory } = props;
  const material: Material = materialInventory.material;

  return (
    <div className='card' id={material._id}>
      <div className='card-header flex-center-center-row'>
        <div className='col col-left'>
          <h2 className='material-id'>{material.materialId}</h2>
        </div>
        <div className='col col-right'>
          <div class='po-container'>
            <i className="fa-light fa-calendar" onClick={(e) => togglePurchaseOrders(e)}></i>
            <div class='modal-background'>
              <div class='modal-box'>
                <div class='left'>
                  <div class='title-wrapper'>
                    <h4>Purchase orders: {material.materialId}</h4>
                  </div>
                  <div class='purchase-order-info-wrapper'>
                    <div class='po-table'>
                      <div class='tb-header'>
                        <div class='tb-cell cell-one'>
                          <div class='pulse-indicator'></div>
                          PO #
                        </div>
                        <div class='tb-cell cell-two'>
                          Order Date
                        </div>
                        <div class='tb-cell cell-three'>
                          Arrival Date
                        </div>
                        <div class='tb-cell cell-four'>
                          Total Feet
                        </div>
                      </div>
                      {renderPurchaseOrders(materialInventory)}
                    </div>
                  </div>
                </div>
                <div class='right'>
                  left panel for storm to do something neat
                </div>
                <i class="fa-light fa-xmark" onClick={closeModal}></i>

              </div>
            </div>
          </div>
          <a href={"/materials/update/" + material._id}><i className="fa-regular fa-pen-to-square"></i></a>
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

export default Material;
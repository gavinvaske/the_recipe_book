import React from 'react';
import './LabelsPerRoll.scss';
import { observer } from 'mobx-react-lite';
import quoteStore from '../../../../../stores/quoteStore'

const LABELS_PER_ROLL = {
    ONE_HUNDRED: 100,
    TWO_HUNDRED_FIFETY: 250,
    FIVE_HUNDRED: 500,
    ONE_THOUSAND: 1000,
    TWO_THOUSAND: 2000,
    FOUR_THOUSAND: 4000
}


export default LabelsPerRoll = observer(() => {
    const { quoteInputs } = quoteStore;

    const increaseLabelsPerRoll = (e) => {
      const labelsPerRollToAdd = Number(e.target.innerText);
      const previousLabelsPerRoll = quoteInputs.labelsPerRollOverride || 0;

      quoteInputs.labelsPerRollOverride = previousLabelsPerRoll + labelsPerRollToAdd;
    }

    const resetLabelsPerRoll = () => {
      delete quoteInputs.labelsPerRollOverride;
    }

    return (
      <>
        <i class="fa-regular fa-rotate-right" onClick={() => resetLabelsPerRoll()}></i>
        <div className='left-col column'>
          <div className='input-title'>Labels Per Roll:</div>
          <div className='button-frame'>
            <button onClick={increaseLabelsPerRoll}>{LABELS_PER_ROLL.ONE_HUNDRED}</button>
            <button onClick={increaseLabelsPerRoll}>{LABELS_PER_ROLL.TWO_HUNDRED_FIFETY}</button>
            <button onClick={increaseLabelsPerRoll}>{LABELS_PER_ROLL.FIVE_HUNDRED}</button>
            <button onClick={increaseLabelsPerRoll}>{LABELS_PER_ROLL.ONE_THOUSAND}</button>
            <button onClick={increaseLabelsPerRoll}>{LABELS_PER_ROLL.TWO_THOUSAND}</button>
            <button onClick={increaseLabelsPerRoll}>{LABELS_PER_ROLL.FOUR_THOUSAND}</button>
          </div>
        </div>
        <div className='right-col column'>
            <input name='labelsPerRollOverride' id='labels-per-roll-output' value={quoteInputs.labelsPerRollOverride || 0} onChange={(e) => quoteInputs.labelsPerRollOverride = Number(e.target.value)} />
        </div>
      </>
    );
});
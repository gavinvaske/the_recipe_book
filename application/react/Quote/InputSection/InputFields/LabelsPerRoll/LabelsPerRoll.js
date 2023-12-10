import React from 'react';
import './LabelsPerRoll.scss';

export default LabelsPerRoll = () => {
    return (
        <>
        <i class="fa-regular fa-rotate-right"></i>
        <div className='left-col column'>
            <div className='input-title'>Labels Per Roll:</div>
            <div className='button-frame'>
                <button>100</button>
                <button>250</button>
                <button>500</button>
                <button>1000</button>
                <button>2000</button>
                <button>4000</button>
            </div>
        </div>
        <div className='right-col column'>
            <input id='labels-per-roll-output' defaultValue={0}/>
        </div>
        </>
    );
}
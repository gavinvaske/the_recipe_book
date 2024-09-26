import React from 'react';
import './QuoteHeader.scss';

export default QuoteHeader = () => {
    return (
        <div className='quote-header-section flex-center-space-between-row full-width'>
            <div className='card'>
                <input/>
                </div>
            <div className='card flex-center-center-row'>
                <h1>#40001</h1>
            </div>
            <div className='card'>3</div>
            <div className='card'>4</div>
        </div>
    );
  }
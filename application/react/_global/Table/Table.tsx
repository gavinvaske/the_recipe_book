import React from 'react'
import './Table.scss'

export const Table = (props) => {
  const { children } = props;
  return (
    <div className='primary-table'>
      {children}
    </div>
  )
}
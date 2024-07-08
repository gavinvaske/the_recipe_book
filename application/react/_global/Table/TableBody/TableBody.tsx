import React from 'react'

export const TableBody = (props) => {
  const { children } = props;

  return (
    <div className='primary-table-body'>
      {children}
    </div>
  )
}

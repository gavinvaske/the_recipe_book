import React from 'react'

export const TableBody = (props) => {
  const { children } = props;

  return (
    <div className='table-body'>
      {children}
    </div>
  )
}

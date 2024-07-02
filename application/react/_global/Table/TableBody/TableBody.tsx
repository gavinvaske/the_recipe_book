import React from 'react'

export const TableBody = (props) => {
  const { children } = props;

  return (
    <div className='pri-tbl-bdy'>
      {children}
    </div>
  )
}

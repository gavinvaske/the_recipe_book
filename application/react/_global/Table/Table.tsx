import React from 'react'

export const Table = (props) => {
  const { children } = props;
  return (
    <div className='table'>
      {children}
    </div>
  )
}
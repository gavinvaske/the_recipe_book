import React from 'react'

export const Table = (props) => {
  const { children } = props;
  return (
    <div className='pri-tbl'>
      {children}
    </div>
  )
}
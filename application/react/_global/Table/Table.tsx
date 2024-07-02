import React from 'react'

export const Table = (props) => {
  const { children, id } = props;
  return (
    <div className='pri-tbl' id={id}>
      {children}
    </div>
  )
}
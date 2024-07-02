import React, { PropsWithChildren } from 'react'

type Props = {
  id?: string
}

export const Table = (props: PropsWithChildren<Props>) => {
  const { children, id } = props;

  return (
    <div className='pri-tbl' id={id}>
      {children}
    </div>
  )
}
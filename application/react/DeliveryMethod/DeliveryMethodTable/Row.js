import React from 'react'
import { flexRender } from '@tanstack/react-table'

const Row = (props) => {
  const { row } = props;

  return (
    <div className='row' key={row.id}>
      {row.getVisibleCells().map(cell => (
        <div className='row-cell' key={cell.id}>
          {flexRender(cell.column.columnDef.cell, cell.getContext())}
        </div>
      ))}
    </div>
  )
}

export default Row
import React from 'react'
import { Header, RowData, flexRender } from '@tanstack/react-table'
import './RowHeader.scss'

const RowHeader = (props) => {
  const { columnHeaders }: {columnHeaders: Header<RowData, unknown>[]} = props;

  const getSortIcon = (sortDirection) => {
    if (sortDirection === 'asc') {
      return <i className="fa-regular fa-arrow-down"></i>
    } else if (sortDirection === 'desc') {
      return <i className="fa-regular fa-arrow-up"></i>
    } else {
      return <i className="fa-regular fa-arrow-up-arrow-down"></i>
    }
  }

  return (
    <div className='primary-table-header'>
      <div className='row-header'>
      {
        columnHeaders.map(header => (
          <div className='column-header' key={header.id} onClick={header.column.getToggleSortingHandler()} style={{cursor: header.column.getCanSort() ? 'pointer' : ''}}>
            <div className='column-icon'>
              {
                header.column.getCanSort() && getSortIcon(header.column.getIsSorted())
              }
            </div>
            <div className='column-name'>
              {
                header.isPlaceholder
                  ? null
                  : flexRender(
                      header.column.columnDef.header,
                      header.getContext()
                    )
              }
            </div>
          </div>
        ))
      }
      </div>
    </div>
  )
}

export default RowHeader
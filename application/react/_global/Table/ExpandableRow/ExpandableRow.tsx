import React from 'react'
import Row from '../Row/Row'
import './ExpandableRow.scss'
import { RowData, Row as tRow } from '@tanstack/react-table'

const ExpandableRow = (props) => {
  const { 
    row, 
    children 
  } : {
    row: tRow<RowData>,
    children: React.ReactNode
  } = props;

  const [expanded, setExpanded] = React.useState(false)
  const toggleExpanded = () => setExpanded(!expanded);

  return (
    <div className='expandable-row' onClick={() => toggleExpanded()} key={row.id} style={{cursor: children ? 'pointer' : ''}}>
      <Row row={row} />
      { expanded && children }
    </div>
  )
}

export default ExpandableRow
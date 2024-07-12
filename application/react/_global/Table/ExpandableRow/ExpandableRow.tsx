import React from 'react'
import Row from '../Row/Row'
import './ExpandableRow.scss'
import { RowData, Row as tRow } from '@tanstack/react-table'

type Props = {
  row: tRow<RowData>,
  children: React.ReactNode
}

const ExpandableRow = (props: Props) => {
  const { row, children } = props;

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
import React from 'react'
import Row from '../Row/Row'
import './ExpandableRow.scss'

const ExpandableRow = (props) => {
  const { row, ExpandedRowContent } = props
  const [expanded, setExpanded] = React.useState(false)

  if (!ExpandedRowContent) throw new Error('ExpandableRow.ExpandedRowContent is required')

  const toggleExpanded = () => setExpanded(!expanded);

  return (
    <div className='expandable-row' onClick={() => toggleExpanded()} key={row.id}>
      <Row row={row} />
      { expanded && <ExpandedRowContent /> }
    </div>
  )
}

export default ExpandableRow
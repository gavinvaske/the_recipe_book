import React from 'react'
import Row from './Row'

const ExpandableRow = (props) => {
  const { row } = props
  const [expanded, setExpanded] = React.useState(false)

  const toggleExpanded = () => {
    setExpanded(!expanded)
  }

  return (
    <div className='expandable-row' onClick={() => toggleExpanded()}>
      <Row row={row}/>
      {
        expanded &&
        <div className='expandable-row-content'>
          <p>TODO: Additional Row Details</p>
        </div>
      }
    </div>
  )
}

export default ExpandableRow
import React, { forwardRef } from 'react'
import './SearchBar.scss'

type Props = {
  value: string,
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
}
const SearchBar = forwardRef((props: Props, ref: any) => {
  const { value, onChange} = props;

function clearInput() {
  const elem = document.getElementById('primarySearch');
  elem.value = '';
}


  return (
    <div className='search-bar'>
      <input ref={ref} id='primarySearch' type='text' value={value} onChange={onChange} placeholder="Search" />
      <i className="fa-light fa-xmark" onClick={clearInput}></i>
    </div>
  )
})

export default SearchBar
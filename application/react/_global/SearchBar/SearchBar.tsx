import React from 'react'
import './SearchBar.scss'

const SearchBar = (props: {value: string, onChange: (e: React.ChangeEvent<HTMLInputElement>) => void}) => {
  const { value, onChange } = props;

function clearInput() {
  const elem = document.getElementById('primarySearch');
  elem.value = '';
}


  return (
    <div className='search-bar'>
      <input id='primarySearch' type='text' value={value} onChange={onChange} placeholder="Search" />
      <i class="fa-light fa-xmark" onClick={clearInput}></i>
    </div>
  )
}

export default SearchBar
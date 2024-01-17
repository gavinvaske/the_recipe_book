import React from 'react'

const SearchBar = (props) => {
  const { value, onChange } = props;

  return (
    <div className='search-bar'>
      <input type='text' value={value} onChange={onChange} />
    </div>
  )
}

export default SearchBar
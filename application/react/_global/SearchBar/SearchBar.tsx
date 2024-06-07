import React from 'react'
import './SearchBar.scss'

const SearchBar = (props: {value: string, onChange: (e: React.ChangeEvent<HTMLInputElement>) => void}) => {
  const { value, onChange } = props;

  return (
    <div className='search-bar'>
      <input type='text' value={value} onChange={onChange} placeholder="Search" />
    </div>
  )
}

export default SearchBar
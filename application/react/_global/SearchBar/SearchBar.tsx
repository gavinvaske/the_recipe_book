import React, { forwardRef, useState } from 'react'
import './SearchBar.scss'

type Props = {
  value: string,
  performSearch: (value: string) => void
}

const SearchBar = forwardRef((props: Props, ref: any) => {
  const { value, performSearch } = props;
  const [inputValue, setInputValue] = useState(value);

  const handleOnKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key !== 'Enter') return;

    performSearch(inputValue);
  }

  const handleOnChange = (e: any) => {
    const trimmedValue = e.target.value?.trim() || '';
    setInputValue(trimmedValue);
    
    if (!trimmedValue) {
      performSearch('');
    }
  }

  return (
    <div className={value ? 'search-bar has-text' : 'search-bar'} data-test='searchbar'>
      <input ref={ref} id='primarySearch' type='text' defaultValue={value} onKeyDown={handleOnKeyDown} onChange={handleOnChange} placeholder="Search" />
    </div>
  )
})

export default SearchBar
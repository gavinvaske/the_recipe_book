import React, { forwardRef } from 'react'
import './SearchBar.scss'


type Props = {
  value: string,
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
}
const SearchBar = forwardRef((props: Props, ref: any) => {
  const { value, onChange} = props;



  return (
    <div className={value ? 'search-bar has-text' : 'search-bar'}>
      <input ref={ref} id='primarySearch' type='text' value={value} onChange={onChange} placeholder="Search" />
    </div>
  )
})

export default SearchBar
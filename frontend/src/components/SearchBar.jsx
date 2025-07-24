import React from 'react'
import styled from 'styled-components'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSearch } from '@fortawesome/free-solid-svg-icons'

const SearchContainer = styled.div`
  display: flex;
  align-items: center;
  background: #f1f5f9;
  padding: 0.5rem 1rem;
  border-radius: 8px;
  width: 100%;
  max-width: 300px;
  border: 1px solid #cbd5e1;

  &:focus-within {
    border-color: #38bdf8;
  }
`

const SearchInput = styled.input`
  border: none;
  background: transparent;
  outline: none;
  margin-left: 0.5rem;
  flex: 1;
  font-size: 1rem;
  color: #0f172a;
`

const SearchBar = ({ placeholder = 'Search...', onChange }) => {
  return (
    <SearchContainer>
      <FontAwesomeIcon icon={faSearch} color="#94a3b8" />
      <SearchInput
        type="text"
        placeholder={placeholder}
        onChange={(e) => onChange && onChange(e.target.value)}
      />
    </SearchContainer>
  )
}

export default SearchBar

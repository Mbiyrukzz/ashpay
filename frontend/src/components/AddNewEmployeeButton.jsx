import React from 'react'
import styled from 'styled-components'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faUserPlus } from '@fortawesome/free-solid-svg-icons'

const Button = styled.button`
  background-color: #2563eb;
  color: white;
  padding: 0.6rem 1.4rem;
  font-size: 1rem;
  font-weight: 600;
  border: none;
  border-radius: 8px;
  display: inline-flex;
  align-items: center;
  gap: 0.6rem;
  cursor: pointer;
  transition: background-color 0.2s ease;
  line-height: 1;

  svg {
    font-size: 1.1rem;
    vertical-align: middle;
  }

  &:hover {
    background-color: #1d4ed8;
  }
`

const AddNewEmployeeButton = ({ onClick }) => {
  return (
    <Button onClick={onClick}>
      <FontAwesomeIcon icon={faUserPlus} />
      <span>Add New Employee</span>
    </Button>
  )
}

export default AddNewEmployeeButton

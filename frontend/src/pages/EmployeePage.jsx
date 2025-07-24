import React, { useState } from 'react'
import styled from 'styled-components'
import EmployeeList from '../components/EmployeeList'
import AddNewEmployeeButton from '../components/AddNewEmployeeButton'
import Modal from '../components/Modal'
import AddEmployeeForm from '../components/AddEmployeeForm'

const PageContainer = styled.div`
  padding: 2rem;
  background: #f0f4f8;
  min-height: 100vh;
`

const HeaderRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  margin-bottom: 2rem;
`

const Header = styled.h1`
  font-size: 2rem;
  color: #1a202c;
  margin: 0;
`

const ModalContent = styled.div`
  padding: 1.5rem;
  min-width: 300px;

  h2 {
    margin-top: 0;
  }

  p {
    margin-bottom: 0;
  }
`

const EmployeePage = () => {
  const [isModalOpen, setIsModalOpen] = useState(false)

  const openModal = () => setIsModalOpen(true)
  const closeModal = () => setIsModalOpen(false)

  return (
    <PageContainer>
      <HeaderRow>
        <Header>Employee Management</Header>
        <AddNewEmployeeButton onClick={openModal} />
      </HeaderRow>

      <EmployeeList />

      <Modal isOpen={isModalOpen} onClose={closeModal}>
        <ModalContent>
          <h2>Add New Employee</h2>
          <AddEmployeeForm onSuccess={() => {}} onClose={closeModal} />
        </ModalContent>
      </Modal>
    </PageContainer>
  )
}

export default EmployeePage

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
  gap: 1rem;
`

const Header = styled.h1`
  font-size: 2rem;
  color: #1a202c;
  margin: 0;

  @media (max-width: 768px) {
    font-size: 1.5rem;
  }
`

// Updated Modal styles to accommodate larger form
const StyledModal = styled(Modal)`
  .modal-container {
    width: 95%;
    max-width: 900px;
    max-height: 90vh;
    padding: 0;
    overflow: hidden;
  }
`

const ModalHeader = styled.div`
  padding: 1.5rem 2rem;
  border-bottom: 1px solid #e2e8f0;
  background: #f8fafc;

  h2 {
    margin: 0;
    color: #1a202c;
    font-size: 1.5rem;
  }
`

const ModalBody = styled.div`
  padding: 2rem;
  overflow-y: auto;
  max-height: calc(90vh - 100px);
`

const LoadingOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.3);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;

  .spinner {
    width: 40px;
    height: 40px;
    border: 4px solid #f3f3f3;
    border-top: 4px solid #2563eb;
    border-radius: 50%;
    animation: spin 1s linear infinite;
  }

  @keyframes spin {
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(360deg);
    }
  }
`

const EmployeePage = () => {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isCreating, setIsCreating] = useState(false)

  const openModal = () => setIsModalOpen(true)

  const closeModal = () => {
    if (!isCreating) {
      setIsModalOpen(false)
    }
  }

  const handleEmployeeCreated = () => {
    // This will be called when employee is successfully created
    console.log('Employee created successfully!')
    // You could add additional logic here like showing a toast notification
    // or refreshing the employee list if needed
  }

  const handleFormSubmissionStart = () => {
    setIsCreating(true)
  }

  const handleFormSubmissionEnd = () => {
    setIsCreating(false)
  }

  return (
    <PageContainer>
      <HeaderRow>
        <Header>Employee Management</Header>
        <AddNewEmployeeButton onClick={openModal} />
      </HeaderRow>

      <EmployeeList />

      <Modal isOpen={isModalOpen} onClose={closeModal}>
        <ModalHeader>
          <h2>Add New Employee</h2>
        </ModalHeader>
        <ModalBody>
          <AddEmployeeForm
            onClose={closeModal}
            onSuccess={handleEmployeeCreated}
            onSubmissionStart={handleFormSubmissionStart}
            onSubmissionEnd={handleFormSubmissionEnd}
          />
        </ModalBody>
      </Modal>

      {isCreating && (
        <LoadingOverlay>
          <div className="spinner"></div>
        </LoadingOverlay>
      )}
    </PageContainer>
  )
}

export default EmployeePage

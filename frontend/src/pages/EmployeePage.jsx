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

const ActionsContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  position: relative;
`

const QuickActionsContainer = styled.div`
  position: relative;
`

const QuickActionsButton = styled.button`
  background: #6366f1;
  color: white;
  border: none;
  padding: 0.6rem 1.2rem;
  border-radius: 8px;
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  transition: all 0.2s ease;
  box-shadow: 0 2px 4px rgba(99, 102, 241, 0.2);

  &:hover {
    background: #5856eb;
    transform: translateY(-1px);
    box-shadow: 0 4px 8px rgba(99, 102, 241, 0.3);
  }

  &:active {
    transform: translateY(0);
  }
`

const QuickActionsDropdown = styled.div`
  position: absolute;
  top: 100%;
  right: 0;
  background: white;
  border-radius: 12px;
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1),
    0 10px 10px -5px rgba(0, 0, 0, 0.04);
  min-width: 280px;
  z-index: 1000;
  margin-top: 0.5rem;
  opacity: ${(props) => (props.isOpen ? 1 : 0)};
  visibility: ${(props) => (props.isOpen ? 'visible' : 'hidden')};
  transform: ${(props) =>
    props.isOpen ? 'translateY(0)' : 'translateY(-10px)'};
  transition: all 0.2s ease;
  border: 1px solid #e5e7eb;
`

const DropdownSection = styled.div`
  padding: 0.5rem 0;

  &:not(:last-child) {
    border-bottom: 1px solid #f3f4f6;
  }
`

const SectionTitle = styled.div`
  padding: 0.5rem 1rem;
  font-size: 0.75rem;
  font-weight: 600;
  color: #6b7280;
  text-transform: uppercase;
  letter-spacing: 0.5px;
`

const QuickActionItem = styled.button`
  display: flex;
  align-items: center;
  padding: 0.75rem 1rem;
  color: #374151;
  background: none;
  border: none;
  font-size: 0.875rem;
  gap: 0.75rem;
  width: 100%;
  text-align: left;
  cursor: pointer;
  transition: all 0.15s ease;

  &:hover {
    background: #f9fafb;
    color: #111827;
  }

  svg {
    width: 18px;
    height: 18px;
    color: #6b7280;
    transition: color 0.15s ease;
  }

  &:hover svg {
    color: #4f46e5;
  }

  .action-text {
    flex: 1;
  }

  .action-description {
    font-size: 0.75rem;
    color: #9ca3af;
    margin-top: 2px;
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

const Overlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 999;
  display: ${(props) => (props.isOpen ? 'block' : 'none')};
`

const EmployeePage = () => {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isCreating, setIsCreating] = useState(false)
  const [isQuickActionsOpen, setIsQuickActionsOpen] = useState(false)
  const [modalContent, setModalContent] = useState({
    type: 'add',
    title: 'Add New Employee',
  })

  const openModal = () => setIsModalOpen(true)

  const closeModal = () => {
    if (!isCreating) {
      setIsModalOpen(false)
    }
  }

  const toggleQuickActions = () => {
    setIsQuickActionsOpen(!isQuickActionsOpen)
  }

  const closeQuickActions = () => {
    setIsQuickActionsOpen(false)
  }

  const handleEmployeeCreated = () => {
    console.log('Employee created successfully!')
  }

  const handleFormSubmissionStart = () => {
    setIsCreating(true)
  }

  const handleFormSubmissionEnd = () => {
    setIsCreating(false)
  }

  // Quick Actions Handlers
  const handleBulkEdit = () => {
    setModalContent({ type: 'bulk-edit', title: 'Bulk Edit Employees' })
    setIsModalOpen(true)
    closeQuickActions()
  }

  const handleAdvancePayment = () => {
    setModalContent({ type: 'advance', title: 'Process Advance Payment' })
    setIsModalOpen(true)
    closeQuickActions()
  }

  const handleLoanManagement = () => {
    setModalContent({ type: 'loan', title: 'Loan Management' })
    setIsModalOpen(true)
    closeQuickActions()
  }

  const handleBulkExport = () => {
    console.log('Bulk export triggered')
    closeQuickActions()
  }

  const handleBulkPayslips = () => {
    console.log('Bulk payslips triggered')
    closeQuickActions()
  }

  const handleImportEmployees = () => {
    setModalContent({ type: 'import', title: 'Import Employees' })
    setIsModalOpen(true)
    closeQuickActions()
  }

  const handleViewArchive = () => {
    setModalContent({ type: 'archive', title: 'Employee Archive' })
    setIsModalOpen(true)
    closeQuickActions()
  }

  const handlePayrollSettings = () => {
    setModalContent({ type: 'payroll-settings', title: 'Payroll Settings' })
    setIsModalOpen(true)
    closeQuickActions()
  }

  const renderModalContent = () => {
    switch (modalContent.type) {
      case 'add':
        return (
          <AddEmployeeForm
            onClose={closeModal}
            onSuccess={handleEmployeeCreated}
            onSubmissionStart={handleFormSubmissionStart}
            onSubmissionEnd={handleFormSubmissionEnd}
          />
        )
      case 'bulk-edit':
        return <div>Bulk Edit Component Goes Here</div>
      case 'advance':
        return <div>Advance Payment Component Goes Here</div>
      case 'loan':
        return <div>Loan Management Component Goes Here</div>
      case 'import':
        return <div>Import Employees Component Goes Here</div>
      case 'archive':
        return <div>Employee Archive Component Goes Here</div>
      case 'payroll-settings':
        return <div>Payroll Settings Component Goes Here</div>
      default:
        return <div>Content not found</div>
    }
  }

  return (
    <PageContainer>
      <Overlay isOpen={isQuickActionsOpen} onClick={closeQuickActions} />

      <HeaderRow>
        <Header>Employee Management</Header>

        <ActionsContainer>
          <AddNewEmployeeButton onClick={openModal} />

          <QuickActionsContainer>
            <QuickActionsButton onClick={toggleQuickActions}>
              <svg
                viewBox="0 0 20 20"
                fill="currentColor"
                width="18"
                height="18"
              >
                <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
              </svg>
              Quick Actions
              <svg
                viewBox="0 0 20 20"
                fill="currentColor"
                width="16"
                height="16"
                style={{
                  transform: isQuickActionsOpen
                    ? 'rotate(180deg)'
                    : 'rotate(0deg)',
                  transition: 'transform 0.2s ease',
                }}
              >
                <path
                  fillRule="evenodd"
                  d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                  clipRule="evenodd"
                />
              </svg>
            </QuickActionsButton>

            <QuickActionsDropdown isOpen={isQuickActionsOpen}>
              <DropdownSection>
                <SectionTitle>Employee Actions</SectionTitle>

                <QuickActionItem onClick={handleBulkEdit}>
                  <svg viewBox="0 0 20 20" fill="currentColor">
                    <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                  </svg>
                  <div className="action-text">
                    Bulk Edit
                    <div className="action-description">
                      Edit multiple employees at once
                    </div>
                  </div>
                </QuickActionItem>

                <QuickActionItem onClick={handleImportEmployees}>
                  <svg viewBox="0 0 20 20" fill="currentColor">
                    <path
                      fillRule="evenodd"
                      d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM6.293 6.707a1 1 0 010-1.414l3-3a1 1 0 011.414 0l3 3a1 1 0 01-1.414 1.414L11 5.414V13a1 1 0 11-2 0V5.414L7.707 6.707a1 1 0 01-1.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <div className="action-text">
                    Import Employees
                    <div className="action-description">
                      Upload CSV or Excel file
                    </div>
                  </div>
                </QuickActionItem>

                <QuickActionItem onClick={handleViewArchive}>
                  <svg viewBox="0 0 20 20" fill="currentColor">
                    <path d="M4 3a2 2 0 100 4h12a2 2 0 100-4H4z" />
                    <path
                      fillRule="evenodd"
                      d="M3 8h14v7a2 2 0 01-2 2H5a2 2 0 01-2-2V8zm5 3a1 1 0 011-1h2a1 1 0 110 2H9a1 1 0 01-1-1z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <div className="action-text">
                    View Archive
                    <div className="action-description">
                      Access inactive employees
                    </div>
                  </div>
                </QuickActionItem>
              </DropdownSection>

              <DropdownSection>
                <SectionTitle>Financial Actions</SectionTitle>

                <QuickActionItem onClick={handleAdvancePayment}>
                  <svg viewBox="0 0 20 20" fill="currentColor">
                    <path d="M4 4a2 2 0 00-2 2v4a2 2 0 002 2V6h10a2 2 0 00-2-2H4z" />
                    <path d="M6 6a2 2 0 012-2h8a2 2 0 012 2v6a2 2 0 01-2 2H8a2 2 0 01-2-2V6zM8 8a1 1 0 011-1h2a1 1 0 110 2H9a1 1 0 01-1-1zm1 3a1 1 0 100 2h2a1 1 0 100-2H9z" />
                  </svg>
                  <div className="action-text">
                    Advance Payment
                    <div className="action-description">
                      Process salary advances
                    </div>
                  </div>
                </QuickActionItem>

                <QuickActionItem onClick={handleLoanManagement}>
                  <svg viewBox="0 0 20 20" fill="currentColor">
                    <path
                      fillRule="evenodd"
                      d="M4 4a2 2 0 00-2 2v8a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2H4zm3 5a1 1 0 011-1h4a1 1 0 110 2H8a1 1 0 01-1-1zm0 3a1 1 0 011-1h4a1 1 0 110 2H8a1 1 0 01-1-1z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <div className="action-text">
                    Loan Management
                    <div className="action-description">
                      Manage employee loans
                    </div>
                  </div>
                </QuickActionItem>

                <QuickActionItem onClick={handlePayrollSettings}>
                  <svg viewBox="0 0 20 20" fill="currentColor">
                    <path
                      fillRule="evenodd"
                      d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 01.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <div className="action-text">
                    Payroll Settings
                    <div className="action-description">
                      Configure payroll parameters
                    </div>
                  </div>
                </QuickActionItem>
              </DropdownSection>

              <DropdownSection>
                <SectionTitle>Reports & Export</SectionTitle>

                <QuickActionItem onClick={handleBulkPayslips}>
                  <svg viewBox="0 0 20 20" fill="currentColor">
                    <path d="M4 4a2 2 0 00-2 2v1h16V6a2 2 0 00-2-2H4z" />
                    <path
                      fillRule="evenodd"
                      d="M18 9H2v5a2 2 0 002 2h12a2 2 0 002-2V9zM4 13a1 1 0 011-1h1a1 1 0 110 2H5a1 1 0 01-1-1zm5-1a1 1 0 100 2h1a1 1 0 100-2H9z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <div className="action-text">
                    Generate Payslips
                    <div className="action-description">
                      Create bulk payslips
                    </div>
                  </div>
                </QuickActionItem>

                <QuickActionItem onClick={handleBulkExport}>
                  <svg viewBox="0 0 20 20" fill="currentColor">
                    <path
                      fillRule="evenodd"
                      d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <div className="action-text">
                    Export All Data
                    <div className="action-description">
                      Download employee data
                    </div>
                  </div>
                </QuickActionItem>
              </DropdownSection>
            </QuickActionsDropdown>
          </QuickActionsContainer>
        </ActionsContainer>
      </HeaderRow>

      <EmployeeList />

      <StyledModal isOpen={isModalOpen} onClose={closeModal}>
        <ModalHeader>
          <h2>{modalContent.title}</h2>
        </ModalHeader>
        <ModalBody>{renderModalContent()}</ModalBody>
      </StyledModal>

      {isCreating && (
        <LoadingOverlay>
          <div className="spinner"></div>
        </LoadingOverlay>
      )}
    </PageContainer>
  )
}

export default EmployeePage

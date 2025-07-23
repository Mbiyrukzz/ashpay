// components/Sidebar.jsx
import React from 'react'
import styled from 'styled-components'
import {
  faTachometerAlt,
  faUser,
  faCalendarAlt,
  faMoneyBill,
  faChartBar,
  faCogs,
} from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

const SidebarContainer = styled.div`
  width: 250px;
  background: #0b0f19;
  color: white;
  display: flex;
  flex-direction: column;
  padding: 2rem 1rem;
`

const Logo = styled.div`
  font-size: 1.5rem;
  font-weight: bold;
  color: #00d084;
  margin-bottom: 2rem;
`

const NavItem = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 0.75rem 1rem;
  margin-bottom: 0.5rem;
  border-radius: 10px;
  cursor: pointer;
  background: ${({ active }) => (active ? '#1a202e' : 'transparent')};

  &:hover {
    background: #1a202e;
  }
`

const Sidebar = () => {
  return (
    <SidebarContainer>
      <Logo>AshPay</Logo>
      <NavItem active>
        <FontAwesomeIcon icon={faTachometerAlt} /> Dashboard
      </NavItem>
      <NavItem>
        <FontAwesomeIcon icon={faUser} /> Employee
      </NavItem>
      <NavItem>
        <FontAwesomeIcon icon={faCalendarAlt} /> Attendance
      </NavItem>
      <NavItem>
        <FontAwesomeIcon icon={faMoneyBill} /> Payroll
      </NavItem>
      <NavItem>
        <FontAwesomeIcon icon={faChartBar} /> Report & Analytics
      </NavItem>
      <NavItem>
        <FontAwesomeIcon icon={faCogs} /> Settings
      </NavItem>
    </SidebarContainer>
  )
}

export default Sidebar

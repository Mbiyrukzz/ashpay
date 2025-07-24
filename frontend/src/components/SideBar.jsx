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
import { NavLink, useLocation } from 'react-router-dom'

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

const StyledNavLink = styled(NavLink)`
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 0.75rem 1rem;
  margin-bottom: 0.5rem;
  border-radius: 10px;
  text-decoration: none;
  color: white;
  background: ${({ $active }) => ($active ? '#1a202e' : 'transparent')};

  &:hover {
    background: #1a202e;
  }
`

const Sidebar = () => {
  const location = useLocation()

  return (
    <SidebarContainer>
      <Logo>AshPay</Logo>
      <StyledNavLink to="/" $active={location.pathname === '/'}>
        <FontAwesomeIcon icon={faTachometerAlt} /> Dashboard
      </StyledNavLink>
      <StyledNavLink
        to="/employees"
        $active={location.pathname === '/employees'}
      >
        <FontAwesomeIcon icon={faUser} /> Employee
      </StyledNavLink>
      <StyledNavLink
        to="/attendance"
        $active={location.pathname === '/attendance'}
      >
        <FontAwesomeIcon icon={faCalendarAlt} /> Attendance
      </StyledNavLink>
      <StyledNavLink to="/payroll" $active={location.pathname === '/payroll'}>
        <FontAwesomeIcon icon={faMoneyBill} /> Payroll
      </StyledNavLink>
      <StyledNavLink
        to="/analytics"
        $active={location.pathname === '/analytics'}
      >
        <FontAwesomeIcon icon={faChartBar} /> Report & Analytics
      </StyledNavLink>
      <StyledNavLink to="/settings" $active={location.pathname === '/settings'}>
        <FontAwesomeIcon icon={faCogs} /> Settings
      </StyledNavLink>
    </SidebarContainer>
  )
}

export default Sidebar

import React from 'react'
import styled from 'styled-components'

const FooterContainer = styled.footer`
  width: 100%;
  padding: 1rem 1.5rem;
  background: #f9fafb;
  color: #6b7280;
  font-size: 0.9rem;
  text-align: center;
  border-top: 1px solid #e5e7eb;
  position: sticky;
  bottom: 0;
  z-index: 10;
`

const Footer = () => {
  const year = new Date().getFullYear()

  return (
    <FooterContainer>
      &copy; {year} Payroll Dashboard. All rights reserved.
    </FooterContainer>
  )
}

export default Footer

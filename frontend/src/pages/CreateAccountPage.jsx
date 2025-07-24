import React from 'react'
import CreateAccountForm from '../components/CreateAccountForm' // adjust the path

const CreateAccountPage = () => {
  return (
    <div
      style={{
        display: 'flex',
        minHeight: '100vh',
        alignItems: 'center',
        justifyContent: 'center',
        background: '#f0f4f8',
      }}
    >
      <CreateAccountForm />
    </div>
  )
}

export default CreateAccountPage

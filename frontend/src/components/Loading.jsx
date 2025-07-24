import styled, { keyframes } from 'styled-components'

const spin = keyframes`
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
`

const Spinner = styled.div`
  width: 50px;
  height: 50px;
  border: 5px solid #334155;
  border-top: 5px solid #38bdf8;
  border-radius: 50%;
  animation: ${spin} 1s linear infinite;
`

const Message = styled.p`
  margin-top: 1rem;
  font-size: 1.1rem;
  color: #000000ff;
`

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  min-height: 300px;
`

const Loading = () => {
  return (
    <Wrapper>
      <Spinner />
      <Message>Loading...</Message>
    </Wrapper>
  )
}

export default Loading

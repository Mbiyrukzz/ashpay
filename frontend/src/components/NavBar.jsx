import styled from 'styled-components'
import LogoutButton from './LogoutButton'
import SearchBar from './SearchBar'
import useUser from '../hooks/useUser'

const Topbar = styled.div`
  height: 60px;
  background: white;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 2rem;
  border-bottom: 1px solid #e5e7eb;
`

const LeftSection = styled.div`
  font-size: 1.1rem;
  font-weight: 500;
`

const RightSection = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
`

const Avatar = styled.img`
  width: 40px;
  height: 40px;
  border-radius: 50%;
`

const Navbar = () => {
  const { user } = useUser()

  return (
    <Topbar>
      <LeftSection>
        Welcome back{user?.name ? `, ${user.name}` : ''}
      </LeftSection>
      <RightSection>
        <SearchBar />
        <LogoutButton />
        <Avatar
          src={user?.avatarUrl || 'https://i.pravatar.cc/40'}
          alt="avatar"
        />
      </RightSection>
    </Topbar>
  )
}

export default Navbar

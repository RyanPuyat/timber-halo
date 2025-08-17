import styled from 'styled-components';
import MainNav from './MainNav';
import Logo from './Logo';
import Uploader from '../data/Uploader';

const StyledSidebar = styled.aside`
  background-color: var(--color-grey-0);
  padding: 3.2rem 2.4rem;
  border-bottom: 1px solid var(--color-grey-100);
  grid-row: 1 / -1;
  display: flex;
  flex-direction: column;
  gap: 3.2rem;
`;

const StyledDivider = styled.div`
  border-bottom: 1px solid var(--color-grey-200);
`;

function Sidebar() {
  return (
    <StyledSidebar>
      <Logo />
      <StyledDivider />
      <MainNav />
      <Uploader />
    </StyledSidebar>
  );
}

export default Sidebar;

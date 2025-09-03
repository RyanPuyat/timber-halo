import styled from 'styled-components';

const Input = styled.input`
  font-size: 1.4rem;
  padding: 0.8rem 1.2rem;
  border: 1px solid
    ${(props) =>
      props.type === 'white'
        ? 'var(--color-grey-100)'
        : 'var(--color-grey-300)'};
  border-radius: var(--border-radius-sm);
  background-color: var(--color-grey-0);
  font-weight: 500;
  box-shadow: var(--shadow-sm);
  margin-bottom: 1rem;
`;

function Search({ value, onChange }) {
  return (
    <Input
      type="text"
      placeholder="Search User. . ."
      value={value}
      onChange={onChange}
    />
  );
}

export default Search;

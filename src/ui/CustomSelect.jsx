import Select from 'react-select';

const GetcustomStyles = {
  control: (base) => ({
    ...base,
    fontSize: '1.4rem',
    padding: '0.2rem',
    width: '25rem',
    borderRadius: '8px',
    borderColor: 'var(--color-grey-0)',
    boxShadow: 'none',
    '&:hover': {
      borderColor: 'var(--color-brown-300)',
    },
  }),
  option: (base, state) => ({
    ...base,
    fontSize: '1.2rem',
    padding: '0.6rem 1rem',
    backgroundColor: state.isFocused ? 'var(--color-brown-400)' : 'white',
    color: state.isFocused ? 'white' : 'var(--color-grey-700)',
    fontWeight: state.isSelected ? 'bold' : 'normal',
    cursor: 'pointer',
  }),
  menu: (base) => ({
    ...base,
    borderRadius: '8px',
    overflow: 'hidden',
  }),
};

function CustomSelect({ options, value, onChange, ...props }) {
  return (
    <Select
      options={options}
      value={options.find((opt) => opt.value === value) || null}
      onChange={(selected) => onChange(selected.value)}
      styles={GetcustomStyles}
      {...props}
    />
  );
}

export default CustomSelect;

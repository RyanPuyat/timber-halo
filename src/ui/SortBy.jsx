// import { useSearchParams } from 'react-router-dom';
// import CustomSelect from './CustomSelect';

// function SortBy({ options }) {
//   const [searchParams, setSearchParams] = useSearchParams();
//   const sortBy = searchParams.get('sortBy') || '';

//   function handleChange(e) {
//     searchParams.set('sortBy', e.target.value);
//     setSearchParams(searchParams);
//   }

//   return (
//     <CustomSelect
//       options={options}
//       type="white"
//       value={sortBy}
//       onChange={handleChange}
//     />
//   );
// }

// export default SortBy;

import { useSearchParams } from 'react-router-dom';
import CustomSelect from './CustomSelect';

function SortBy({ options }) {
  const [searchParams, setSearchParams] = useSearchParams();
  const sortBy = searchParams.get('sortBy') || '';

  function handleChange(selectedValue) {
    searchParams.set('sortBy', selectedValue);
    setSearchParams(searchParams);
  }

  return (
    <CustomSelect
      options={options}
      type="white"
      value={sortBy}
      onChange={handleChange}
    />
  );
}

export default SortBy;

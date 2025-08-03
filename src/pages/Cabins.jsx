import { useState } from 'react';
import Heading from '../ui/Heading';
import Button from '../ui/Button';
import Row from '../ui/Row';
import CreateCabinForm from '../features/cabins/CreateCabinForm';

import CabinTable from '../features/cabins/CabinTable';

function Cabins() {
  const [showForm, setShowForm] = useState(false);

  return (
    <>
      <Row type="horizontal">
        <Heading as="h1">All Cabins</Heading>
        <p>Filter / Sort</p>
      </Row>

      <Row type="vertical">
        <CabinTable />
        <Button onClick={() => setShowForm((show) => !show)}>
          Add new cabin
        </Button>

        {showForm && <CreateCabinForm />}
      </Row>
    </>
  );
}

export default Cabins;

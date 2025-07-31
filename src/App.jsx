// import styled from 'styled-components';
import GlobalStyles from './styles/GlobalStyle';
import Heading from './ui/Heading';
import Row from './ui/Row';

function App() {
  return (
    <>
      <GlobalStyles />
      <Row type="horizontal">
        <Heading as="h1">The Timber Halo</Heading>
        <Heading as="h2">The Timber Halo</Heading>
        <Heading as="h3">The Timber Halo</Heading>
      </Row>
    </>
  );
}

export default App;

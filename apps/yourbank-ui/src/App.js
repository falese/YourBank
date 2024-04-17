import logo from './logo.svg';
import {Button, Container, Table, Card} from 'yourbank-design'

function App() {
  return (
    <div className="App">
      <Container hasBackground={true}>
        <Card>
        <Button variant='primary'>Push Me</Button>
        </Card>
        
      </Container>
      
    </div>
  );
}

export default App;

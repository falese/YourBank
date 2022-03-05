import logo from './logo.svg';
import './App.css';
import {BrowserRouter as Router, Route} from 'react-router-dom';  
import Navmenu from './Components/navbar';
import ContBox from './Components/container'
import {Container, Row} from 'react-bootstrap';

function App() {
  return (
    <Router>
  
      <Container fluid>
        <Row>
          <Navmenu>
        
          </Navmenu>
          </Row>
       
        </Container>
    
    </Router>
  );
}

export default App;

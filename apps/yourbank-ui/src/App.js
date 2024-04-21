import logo from './logo.svg';
import {Button, Container, Card, Icon, LogoComponent} from 'yourbank-design'

function App() {
  return (
    <div className="App">
      
      <Container 
      useCardStyle={true}
      >
        <Card
        headerTitle="The Your Bank First Card"
        underHeaderIcon={<Icon 
          icon="money" 
          color="red"
          style={{height: '88px', width: '88px'}}
        />}
        footer={<Button variant='primary'>Push Me</Button>}
        >
            <p>
              The card has a header and a footer
            </p>
        </Card>
        <Card
        headerTitle="The Your Bank Second Card"
        underHeaderIcon={<Icon 
          icon="building" 
          color="red"
          style={{height: '88px', width: '88px'}}
        />}
        footer={<Button variant='primary'>Push Me</Button>}
        >
            <p>
              The card has a header and a footer
            </p>
        </Card>
  
        <Card
        headerTitle="The Your Bank Third Card"
        underHeaderIcon={<LogoComponent
          style={{width:'88px', height: '88px',color: 'red'}} 
          />}
        footer={<Button variant='primary'>Push Me</Button>}
        >
            <p>
              The card has a header and a footer
            </p>
        </Card>
        <Card
        headerTitle="The Your Bank Fourth Card"
        underHeaderIcon={<Icon 
          icon="chart" 
          color="red"
          style={{height: '88px', width: '88px'}}
        />}
        footer={<Button variant='primary'>Push Me</Button>}
        >
            <p>
              The card has a header and a footer
            </p>
        </Card>
        
      </Container>

      <Container>
        <Card
        headerTitle="The Your Bank"
        underHeaderIcon={<Icon 
          icon="building" 
          color="red"
          style={{height: '88px', width: '88px'}}
        />}
        footer={<Button variant='primary'>Push Me</Button>}
        >
            <p>
              The card has a header and a footer
            </p>
        </Card>
        
        <Card
        headerTitle="The Your Bank"
        underHeaderIcon={<Icon 
          icon="dollar" 
          color="red"
          style={{height: '88px', width: '88px'}}
        />}
        footer={<Button variant='primary'>Push Me</Button>}
        >
            <p>
              The card has a header and a footer
            </p>
        </Card>
        
        
      </Container>
      
    </div>
  );
}

export default App;

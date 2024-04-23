import logo from './logo.svg';
import {Button, Container, Card, Icon, LogoComponent} from 'yourbank-design'



function App() {
  return (
    <div className="App">
      
      <Container>
      <Container 
      useCardStyle={true}
      >
        <Card
        headerTitle="YourMoney"
        underHeaderIcon={<Icon 
          icon="money" 
          color="red"
          style={{height: '88px', width: '88px'}}
        />}
        footer={<Button variant='primary'>Get Started</Button>}
        >
            <p>
             We can help you move money.  Anywhere, Anytime.
            </p>
        </Card>
        <Card
        headerTitle="YourLoans"
        underHeaderIcon={<Icon 
          icon="building" 
          color="red"
          style={{height: '88px', width: '88px'}}
        />}
        footer={<Button variant='primary'>Get Started</Button>}
        >
            <p>
              We can help you get and manage credit.
            </p>
        </Card>
  
        <Card
        headerTitle="YourRelationship"
        underHeaderIcon={<LogoComponent
          style={{width:'88px', height: '88px',color: 'red'}} 
          />}
        footer={<Button variant='primary'>Get Started</Button>}
        >
            <p>
              We're in this together.
            </p>
        </Card>
        <Card
        headerTitle="YourInsights"
        underHeaderIcon={<Icon 
          icon="chart" 
          color="red"
          style={{height: '88px', width: '88px'}}
        />}
        footer={<Button variant='primary'>Get Started</Button>}
        >
            <p>
              We can help you find the your next big thing.
            </p>
        </Card>
        
      </Container>

      <Container>
        <Card
        headerTitle="About Us"
        underHeaderIcon={<Icon 
          icon="building" 
          color="red"
          style={{height: '88px', width: '88px'}}
        />}
        footer={<Button variant='primary'>Learn More</Button>}
        >
            <p>
              Learn who we are, and why we care so much about you.
            </p>
        </Card>
        
        <Card
        headerTitle="Invest"
        underHeaderIcon={<Icon 
          icon="dollar" 
          color="red"
          style={{height: '88px', width: '88px'}}
        />}
        footer={<Button variant='primary'>Learn More</Button>}
        >
            <p>
              YourBank, its not just how we operate, its how we're owned.
            </p>
        </Card>
        
        
      </Container>
      </Container>

      
    </div>
  );
}

export default App;

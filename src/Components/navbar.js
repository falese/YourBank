import React, {Component} from 'react';
import Navbar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Nav';
import {Container, Col, Row} from 'react-bootstrap'

class NavMenu extends Component{
    render()
    {
        return(
            <Container>
             <Row>
            <Col>YourBank</Col>
            <Col>
            <Navbar bg="dark" expand="lg">
            <Navbar.Brand href="/home">Dashboard</Navbar.Brand>
            <Navbar.Toggle aria-controls="basic-navbar-nav" />
            <Navbar.Collapse id="basic-navbar-nav">
              <Nav className="mr-auto">
                <Nav.Link href="/Statements">Statements</Nav.Link>
                <Nav.Link href="/Payment">Payment</Nav.Link>
              </Nav>
            </Navbar.Collapse>
          </Navbar>
          </Col>
          </Row>   
          </Container>
        )
    }
}

export default NavMenu
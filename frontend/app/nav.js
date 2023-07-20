import React from 'react';
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import NavDropdown from 'react-bootstrap/NavDropdown';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faInstagramSquare } from '@fortawesome/free-brands-svg-icons';
import './NavBar.css'; 

export default function NavBar() {
  return (
    <Navbar expand="lg" className="navbar-dark bg-dark fixed-top">
      <Container>
        <Navbar.Brand href="#home">Projet Aquarius</Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            <Nav.Link href="/">Accueil</Nav.Link>
            <Nav.Link href="/contact">Contact</Nav.Link>
            <NavDropdown title="Menu" id="basic-nav-dropdown">
              <NavDropdown.Item href="/poissons">Poissons</NavDropdown.Item>
              <NavDropdown.Item href="/simulation">Simulation</NavDropdown.Item>
              <NavDropdown.Item href="/cours">Guide pratique</NavDropdown.Item>
              <NavDropdown.Divider />
              <NavDropdown.Item href="#action/3.4">Liens et références</NavDropdown.Item>
            </NavDropdown>
          </Nav>
          <Nav>
            <Nav.Link href="https://www.instagram.com/projet.aquarius.pro" target="_blank">
              <FontAwesomeIcon icon={faInstagramSquare} className="instagram-icon" />
              <span className="instagram-text">Instagram</span>
            </Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}


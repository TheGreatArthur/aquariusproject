/**
 * Barre de navigation principale
 */

import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import NavDropdown from 'react-bootstrap/NavDropdown';


export default function NavBar () {

  return <Navbar expand="lg" className="navbar-dark bg-dark fixed-top">
    <Container>
      <Navbar.Brand href="#home">Projet Aquarius</Navbar.Brand>
      <Navbar.Toggle aria-controls="basic-navbar-nav"/>
      <Navbar.Collapse id="basic-navbar-nav">
        <Nav className="me-auto">
          <Nav.Link href="/">Accueil</Nav.Link>
          <Nav.Link href="/contact">Contact</Nav.Link>
          <NavDropdown title="Menu" id="basic-nav-dropdown">
            <NavDropdown.Item href="/poissons">Poissons</NavDropdown.Item>
            <NavDropdown.Item href="/simulation">
              Simulation
            </NavDropdown.Item>
            <NavDropdown.Item href="#action/3.3">Guide pratique</NavDropdown.Item>
            <NavDropdown.Divider/>
            <NavDropdown.Item href="#action/3.4">
              Liens et références
            </NavDropdown.Item>
          </NavDropdown>
        </Nav>
      </Navbar.Collapse>
    </Container>
  </Navbar>;
}


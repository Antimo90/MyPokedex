import {
  Navbar,
  Nav,
  Container,
  Form,
  FormControl,
  Button,
} from "react-bootstrap";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faUserPlus,
  faSignInAlt,
  faBookOpen,
  faSearch,
} from "@fortawesome/free-solid-svg-icons";
import pokemonLogo from "../assets/logoPokemon.png";

const MyNavbar = () => {
  const handleSearch = (event) => {
    event.preventDefault();
    const query = event.target.elements.searchQuery.value;
    console.log("Cerca Pokémon:", query);
  };

  return (
    <Navbar bg="dark" variant="dark" expand="lg" className="py-0">
      <Container>
        <Navbar.Brand as={Link} to="/">
          <img
            src={pokemonLogo}
            width="100"
            height="auto"
            className="d-inline-block align-top logo-filter"
            alt="MyPokédex Logo"
          />
        </Navbar.Brand>

        <Navbar.Toggle aria-controls="basic-navbar-nav" />

        <Navbar.Collapse id="basic-navbar-nav">
          <Form
            className="d-flex mx-lg-auto my-2 my-lg-0"
            onSubmit={handleSearch}
          >
            <FormControl
              type="search"
              placeholder="Cerca Pokémon..."
              className="me-2"
              aria-label="Search"
              name="searchQuery"
            />
            <Button variant="outline-success" type="submit">
              <FontAwesomeIcon icon={faSearch} />
            </Button>
          </Form>

          <Nav className="ms-auto">
            <Nav.Link
              as={Link}
              to="/pokedex"
              className="d-flex align-items-center me-3"
            >
              <FontAwesomeIcon icon={faBookOpen} className="me-2" />
              MyPokédex
            </Nav.Link>

            <Nav.Link
              as={Link}
              to="/register"
              className="d-flex align-items-center me-3"
            >
              <FontAwesomeIcon icon={faUserPlus} className="me-2" />
              Registrazione
            </Nav.Link>

            <Nav.Link
              as={Link}
              to="/login"
              className="d-flex align-items-center"
            >
              <FontAwesomeIcon icon={faSignInAlt} className="me-2" />
              Login
            </Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default MyNavbar;

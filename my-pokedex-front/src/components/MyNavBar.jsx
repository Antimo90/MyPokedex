import {
  Navbar,
  Nav,
  Container,
  Form,
  FormControl,
  Button,
} from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faUserPlus,
  faSignInAlt,
  faSignOutAlt,
  faBookOpen,
  faSearch,
} from "@fortawesome/free-solid-svg-icons";
import pokemonLogo from "../assets/logoPokemon.png";

// Funzione helper per recuperare il token JWT dal localStorage
const getToken = () => {
  return localStorage.getItem("token");
};

const MyNavbar = () => {
  // Hook per la navigazione programmatica
  const navigate = useNavigate();

  // Funzione per controllare lo stato di login dell'utente (restituisce true o false)
  const isLoggedIn = () => {
    // !! converte il valore del token (stringa o null) in un booleano (true o false)
    return !!getToken();
  };

  // Funzione per gestire il logout
  const handleLogout = () => {
    // Rimuovo il token salvato
    localStorage.removeItem("token");
    // Reindirizzo l'utente alla pagina di login
    navigate("/login");
  };

  // Funzione per gestire l'invio del form di ricerca
  const handleSearch = (event) => {
    event.preventDefault(); // Previene il comportamento di submit di default

    if (!isLoggedIn()) {
      // Se l'utente non è loggato, mostro l'avviso richiesto
      alert("To use the search, you must log in!");
      return; // Blocca il resto della funzione
    }
    // Ottengo il valore inserito nel campo di ricerca tramite il name 'searchQuery'
    const query = event.target.elements.searchQuery.value;

    // Eseguo la ricerca solo se la query non è vuota
    if (query.trim()) {
      // Navigo verso la rotta /pokedex aggiungendo la query come parametro URL
      // Uso encodeURIComponent per gestire caratteri speciali nella ricerca
      navigate(`/pokedex?q=${encodeURIComponent(query.trim())}`);
      // Resetto il campo di ricerca dopo l'invio
      event.target.elements.searchQuery.value = "";
    }
  };

  return (
    // Barra di navigazione con sfondo scuro, sempre espandibile su large
    <Navbar bg="dark" variant="dark" expand="lg" className="py-0">
      <Container>
        {/* Logo/Brand: funge da link alla Home Page */}
        <Navbar.Brand as={Link} to="/">
          <img
            src={pokemonLogo} // Immagine del logo Pokémon
            width="100"
            height="auto"
            className="d-inline-block align-top logo-filter" // Classe personalizzata per eventuale filtro
            alt="MyPokédex Logo"
          />
        </Navbar.Brand>
        {/* Pulsante Toggle per la versione mobile */}
        <Navbar.Toggle aria-controls="basic-navbar-nav" />

        {/* Contenuto collassabile della Navbar */}
        <Navbar.Collapse id="basic-navbar-nav">
          {/* Form di Ricerca: centrato orizzontalmente su schermi grandi */}
          <Form
            className="d-flex mx-lg-auto my-2 my-lg-0"
            onSubmit={handleSearch} // Gestore per l'invio della ricerca
            style={{ paddingLeft: "200px" }} // Spazio extra per centrare meglio su desktop
          >
            <FormControl
              type="search"
              placeholder="Search Pokémon..."
              className="me-2"
              aria-label="Search"
              name="searchQuery" // Importante per recuperare il valore in handleSearch
            />
            {/* Bottone di invio per la ricerca, con icona */}
            <Button variant="danger" type="submit">
              <FontAwesomeIcon icon={faSearch} />
            </Button>
          </Form>

          {/* Sezione di Navigazione a destra (ms-auto) */}
          <Nav className="ms-auto">
            {/* Link a MyPokédex (la pagina principale per l'utente loggato) */}
            <Nav.Link
              as={Link}
              to="/pokedex"
              // Applica classe "text-secondary" se non loggato, per disabilitare visivamente
              className={`d-flex align-items-center me-3 ${
                !isLoggedIn() ? "text-secondary" : ""
              }`}
              // Gestisce il click: se non loggato, blocca la navigazione
              onClick={(e) => {
                if (!isLoggedIn()) {
                  e.preventDefault(); // Impedisce il reindirizzamento se manca il token
                }
              }}
              disabled={!isLoggedIn()} // Attributo disabled basato sullo stato di login
            >
              <FontAwesomeIcon icon={faBookOpen} className="me-2" />
              MyPokedex
            </Nav.Link>

            {/* Render condizionale: Mostra Logout se loggato, altrimenti Registrazione e Login */}
            {isLoggedIn() ? (
              // Opzione Logout
              <Nav.Link
                onClick={handleLogout} // Chiama la funzione di logout
                className="d-flex align-items-center cursor-pointer"
              >
                <FontAwesomeIcon icon={faSignOutAlt} className="me-2" />
                Logout
              </Nav.Link>
            ) : (
              // Opzioni per utenti non loggati
              <>
                {/* Link Registrazione */}
                <Nav.Link
                  as={Link}
                  to="/register"
                  className="d-flex align-items-center me-3 "
                >
                  <FontAwesomeIcon icon={faUserPlus} className="me-2" />
                  Sign Up
                </Nav.Link>

                {/* Link Login */}
                <Nav.Link
                  as={Link}
                  to="/login"
                  className="d-flex align-items-center "
                >
                  <FontAwesomeIcon icon={faSignInAlt} className="me-2" />
                  Login
                </Nav.Link>
              </>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default MyNavbar;

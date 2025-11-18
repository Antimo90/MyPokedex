import { Col, Container, Row } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faGithub,
  faTwitter,
  faLinkedin,
} from "@fortawesome/free-brands-svg-icons";

const MyFooter = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-dark text-white  py-4 mt-0 ">
      <Container>
        <Row>
          <Col lg={4} md={6} className="mb-4">
            <h5 className="text-uppercase mb-3">MyPokedex Project</h5>
            <p className="small">
              Questa applicazione è stata creata a scopo didattico e non è
              affiliata a Nintendo, Creatures Inc. o GAME FREAK. Pokémon e i
              nomi dei personaggi sono marchi registrati.
            </p>
            <p className="mt-3 small">
              &copy; {currentYear} MyPokédex. Tutti i diritti riservati.
            </p>
          </Col>

          <Col lg={4} md={6} className="mb-4">
            <h5 className="text-uppercase mb-3">Link Utili</h5>
            <ul className="list-unstyled">
              <li>
                <a
                  href="#"
                  target="_blank"
                  className="text-white-50 text-decoration-none small"
                >
                  Chi siamo
                </a>
              </li>
              <li>
                <a
                  href="/pokedex"
                  target="_blank"
                  className="text-white-50 text-decoration-none small"
                >
                  Tutti i Pokémon
                </a>
              </li>
              <li>
                <a
                  href="https://pokeapi.co/docs/v2"
                  target="_blank"
                  className="text-white-50 text-decoration-none small"
                >
                  API Documentation
                </a>
              </li>
              <li>
                <a
                  href="#"
                  target="_blank"
                  className="text-white-50 text-decoration-none small"
                >
                  Termini di Servizio
                </a>
              </li>
            </ul>
          </Col>

          <Col lg={4} md={12} className="mb-4">
            <h5 className="text-uppercase mb-3">Seguici</h5>
            <div>
              <a
                href="https://github.com/Antimo90"
                target="_blank"
                rel="noopener noreferrer"
                className="text-white me-3"
              >
                <FontAwesomeIcon icon={faGithub} size="2x" />
              </a>
              <a
                href="https://www.instagram.com/__antimo__/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-white me-3"
              >
                <FontAwesomeIcon icon={faTwitter} size="2x" />
              </a>
              <a
                href="https://www.linkedin.com/in/antimo-mandorino-b25672162/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-white"
              >
                <FontAwesomeIcon icon={faLinkedin} size="2x" />
              </a>
            </div>
          </Col>
        </Row>
      </Container>
    </footer>
  );
};

export default MyFooter;

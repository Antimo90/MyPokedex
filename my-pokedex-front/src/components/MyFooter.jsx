import { Col, Container, Row } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faGithub,
  faTwitter,
  faLinkedin,
} from "@fortawesome/free-brands-svg-icons";

const MyFooter = () => {
  // Calcolo l'anno corrente dinamicamente, utile per l'indicazione del copyright
  const currentYear = new Date().getFullYear();

  return (
    // Elemento <footer> con sfondo scuro, testo bianco e padding verticale
    <footer className="bg-dark text-white py-4 mt-0 ">
      {/* Contenitore di Bootstrap per centrare il contenuto e limitare la larghezza */}
      <Container>
        <Row>
          {/* Colonna 1: Informazioni sul progetto e Copyright */}
          <Col lg={4} md={6} className="mb-4">
            <h5 className="text-uppercase mb-3">MyPokedex Project</h5>
            {/* Disclaimer importante per la non affiliazione con il brand Pokémon */}
            <p className="small">
              This application was created for educational purposes and is not
              affiliated with Nintendo, Creatures Inc., or GAME FREAK. Pokémon
              and character names are registered trademarks.
            </p>
            {/* Visualizzazione dinamica del copyright con l'anno corrente */}
            <p className="mt-3 small">
              &copy; {currentYear} MyPokédex. All rights reserved.
            </p>
          </Col>

          {/* Colonna 2: Link Utili */}
          <Col lg={4} md={6} className="mb-4">
            <h5 className="text-uppercase mb-3">Useful Links</h5>
            {/* Lista non ordinata per i link */}
            <ul className="list-unstyled">
              {/* Link a Chi siamo (attualmente segnaposto '#') */}
              <li>
                <a
                  href="#"
                  target="_blank"
                  className="text-white-50 text-decoration-none small"
                >
                  About Us
                </a>
              </li>
              {/* Link diretto alla Pokedex completa */}
              <li>
                <a
                  href="/pokedex"
                  target="_blank"
                  className="text-white-50 text-decoration-none small"
                >
                  All Pokémon
                </a>
              </li>
              {/* Link esterno alla documentazione ufficiale della PokeAPI */}
              <li>
                <a
                  href="https://pokeapi.co/docs/v2"
                  target="_blank"
                  className="text-white-50 text-decoration-none small"
                >
                  API Documentation
                </a>
              </li>
              {/* Link a Termini di Servizio (attualmente segnaposto '#') */}
              <li>
                <a
                  href="#"
                  target="_blank"
                  className="text-white-50 text-decoration-none small"
                >
                  Terms of Service
                </a>
              </li>
            </ul>
          </Col>

          {/* Colonna 3: Icone Social Media */}
          <Col lg={4} md={12} className="mb-4">
            <h5 className="text-uppercase mb-3">Follow Us</h5>
            <div>
              {/* Link al profilo GitHub, con icona grande */}
              <a
                href="https://github.com/Antimo90"
                target="_blank"
                rel="noopener noreferrer"
                className="text-white me-3"
              >
                <FontAwesomeIcon icon={faGithub} size="2x" />
              </a>
              {/* Link al profilo Instagram (uso icona Twitter come placeholder) */}
              <a
                href="https://www.instagram.com/__antimo__/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-white me-3"
              >
                <FontAwesomeIcon icon={faTwitter} size="2x" />
              </a>
              {/* Link al profilo LinkedIn */}
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

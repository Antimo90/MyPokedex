import { Container, Button, Row, Col } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import ShowcaseSection from "./ShowcaseSection";
import pokeball from "../assets/pokeball.png";

const HomePublic = () => {
  const navigate = useNavigate();

  return (
    <div
      style={{
        backgroundColor: "#d8d8d8ff",
        paddingTop: "60px",
        paddingBottom: "40px",
      }}
    >
      <Container className="text-center ">
        <Row
          className="justify-content-center pt-5 pb-5 mb-5 "
          style={{
            backgroundImage: `url(${pokeball})`,
            backgroundPosition: "center",
            backgroundSize: "cover",
            borderRadius: "10px",
            color: "white",
          }}
        >
          <Col md={10}>
            <h1 className="display-4 fw-bold mb-5 mt-5 pb-3">
              Benvenuto nella Pokedex di Kanto
            </h1>
            <p
              className="lead mt-5 mb-4 fw-bold pt-5 "
              style={{ color: "rgba(240, 35, 35, 1)" }}
            >
              Cattura, organizza e gestisci i tuoi 151 Pokémon di prima
              generazione!
            </p>

            <Button
              variant="warning"
              size="lg"
              className="me-3 fw-bold"
              onClick={() => navigate("/login")}
            >
              Accedi
            </Button>
            <Button
              variant="warning"
              size="lg"
              className="fw-bold"
              onClick={() => navigate("/register")}
            >
              Registrati Ora
            </Button>
          </Col>
        </Row>

        <Row className="justify-content-center mb-5">
          <Col md={8}>
            <Button
              variant="primary"
              size="lg"
              className="fw-bold"
              onClick={() => navigate("/pokedex-pubblico")}
            >
              Controlla il Pokedex di Kanto (Anteprima)
            </Button>
            <p className="text-secondary mt-2 small">
              Visualizza tutti i 151 Pokémon. Accesso completo e gestione solo
              dopo l'accesso.
            </p>
          </Col>
        </Row>

        <Row className="mb-5">
          <Col md={4}>
            <h2 className="text-primary">Schede Complete</h2>
            <p>
              Dati, statistiche e mosse per ogni Pokémon, incluse le versioni
              shiny.
            </p>
          </Col>
          <Col md={4}>
            <h2 className="text-primary">Organizzazione Facile</h2>
            <p>
              Filtri avanzati per trovare il Pokémon giusto nella tua collezione
              in un attimo.
            </p>
          </Col>
          <Col md={4}>
            <h2 className="text-primary">Esperienza Dinamica</h2>
            <p>
              Interfaccia moderna e reattiva, ottimizzata per tutti i
              dispositivi.
            </p>
          </Col>
        </Row>

        <Row className="justify-content-center">
          <Col md={12}>
            <ShowcaseSection />
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default HomePublic;

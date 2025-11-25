import { Container, Button, Row, Col } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import ShowcaseSection from "./ShowcaseSection";
import pokeball from "../assets/pokeball.png";

const HomePublic = () => {
  // Inizializzo l'hook useNavigate che mi servirà per reindirizzare l'utente
  const navigate = useNavigate();

  return (
    // Div esterno che imposta lo sfondo grigio chiaro e gestisce il padding verticale
    <div
      style={{
        backgroundColor: "#d8d8d8ff", // Colore di sfondo standard per il corpo della pagina
        paddingTop: "60px",
        paddingBottom: "40px",
      }}
    >
      {/* Contenitore principale di Bootstrap centrato */}
      <Container className="text-center ">
        {/* Prima riga: l'Hero Section/Banner di benvenuto */}
        <Row
          className="justify-content-center pt-5 pb-5 mb-5 "
          // Stili in linea per creare l'effetto Pokeball come sfondo del banner
          style={{
            backgroundImage: `url(${pokeball})`, // Uso l'immagine importata
            backgroundPosition: "center",
            backgroundSize: "cover", // Assicura che l'immagine copra tutto lo spazio
            borderRadius: "10px", // Angoli arrotondati per un look moderno
            color: "white", // Testo bianco per contrastare lo sfondo scuro
          }}
        >
          {/* Colonna centrale per contenere il testo e i bottoni */}
          <Col md={10}>
            {/* Titolo principale */}
            <h1 className="display-4 fw-bold mb-5 mt-5 pb-3">
              Welcome to the Kanto Pokedex
            </h1>
            {/* Sottotitolo descrittivo, con colore rosso Pokémon */}
            <p
              className="lead mt-5 mb-4 fw-bold pt-5 "
              style={{ color: "rgba(240, 35, 35, 1)" }} // Rosso acceso
            >
              Capture, organize, and manage your first 151 Generation Pokémon!
            </p>

            {/* Bottone per accedere alla pagina di Login */}
            <Button
              variant="warning" // Giallo (simile al colore elettrico/Pokémon)
              size="lg"
              className="me-3 fw-bold"
              onClick={() => navigate("/login")} // Funzione che reindirizza al login
            >
              Login
            </Button>
            {/* Bottone per accedere alla pagina di Registrazione */}
            <Button
              variant="warning" // Anche questo Giallo
              size="lg"
              className="fw-bold"
              onClick={() => navigate("/register")} // Funzione che reindirizza alla registrazione
            >
              Sign Up Now
            </Button>
          </Col>
        </Row>

        {/* Seconda riga: Bottone per l'Anteprima Pubblica */}
        <Row className="justify-content-center mb-5">
          <Col md={8}>
            {/* Bottone che porta direttamente all'elenco pubblico dei Pokémon */}
            <Button
              variant="primary" // Blu (colore standard di Bootstrap)
              size="lg"
              className="fw-bold"
              onClick={() => navigate("/pokedex-pubblico")}
            >
              Check the Kanto Pokedex (Preview)
            </Button>
            {/* Testo di supporto/disclaimer sotto il bottone */}
            <p className="text-secondary mt-2 small">
              View all 151 Pokémon. Full access and management only after
              logging in.
            </p>
          </Col>
        </Row>

        {/* Terza riga: Sezione Feature/Vantaggi principali (3 colonne) */}
        <Row className="mb-5">
          {/* Feature 1 */}
          <Col md={4}>
            <h2 className="text-primary">Full Sheets</h2>
            <p>
              Data, stats, and moves for every Pokémon, including shiny
              versions.
            </p>
          </Col>
          {/* Feature 2 */}
          <Col md={4}>
            <h2 className="text-primary">Easy Organization</h2>
            <p>
              Advanced filters to find the right Pokémon in your collection in
              an instant.
            </p>
          </Col>
          {/* Feature 3 */}
          <Col md={4}>
            <h2 className="text-primary">Dynamic Experience</h2>
            <p>Modern and responsive interface, optimized for all devices.</p>
          </Col>
        </Row>

        {/* Quarta riga: Inclusione del componente ShowcaseSection (vetrina) */}
        <Row className="justify-content-center">
          <Col md={12}>
            {/* Renderizzo la sezione vetrina, che mostra alcuni Pokémon in anteprima */}
            <ShowcaseSection />
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default HomePublic;

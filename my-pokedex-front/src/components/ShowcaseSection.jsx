import { Card, Button } from "react-bootstrap";
import newGeneration from "../assets/nuovagenerazione.jfif";
import battle from "../assets/battaglia.jfif";
import hoho from "../assets/ho-ho.jfif";
import torneo from "../assets/torneo.jfif";

const ShowcaseSection = () => (
  <div
    style={{
      backgroundColor: "#fff",
      padding: "20px",
      borderRadius: "8px",
      boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
    }}
  >
    <h3 className="text-center text-dark mb-4">
      📢 Ultimi Aggiornamenti dal Mondo Pokémon
    </h3>
    <div
      style={{
        display: "flex",
        overflowX: "auto",
        gap: "20px",
        paddingBottom: "10px",
      }}
    >
      <a
        href="https://wiki.pokemoncentral.it/Seconda_generazione"
        target="_blank"
        rel="noopener noreferrer"
        style={{ textDecoration: "none", color: "inherit" }}
      >
        <Card style={{ minWidth: "250px" }}>
          <Card.Img
            variant="top"
            src={newGeneration}
            alt="nuova_generazione"
            style={{ height: "150px", objectFit: "cover" }}
          />
          <Card.Body className="cardBodyStyle">
            <Card.Title>La Nuova Generazione</Card.Title>
          </Card.Body>
        </Card>
      </a>
      <a
        href="https://wiki.pokemoncentral.it/Lotta_Pok%C3%A9mon"
        target="_blank"
        rel="noopener noreferrer"
        style={{ textDecoration: "none", color: "inherit" }}
      >
        <Card style={{ minWidth: "250px" }}>
          <Card.Img
            variant="top"
            src={battle}
            alt="battaglie"
            style={{ height: "150px", objectFit: "cover" }}
          />
          <Card.Body className="cardBodyStyle">
            <Card.Title>Battaglie Emozionanti</Card.Title>
          </Card.Body>
        </Card>
      </a>
      <a
        href="https://wiki.pokemoncentral.it/Ho-Oh"
        target="_blank"
        rel="noopener noreferrer"
        style={{ textDecoration: "none", color: "inherit" }}
      >
        <Card style={{ minWidth: "250px" }}>
          <Card.Img
            variant="top"
            src={hoho}
            alt="ho_ho"
            style={{ height: "150px", objectFit: "cover" }}
          />
          <Card.Body className="cardBodyStyle">
            <Card.Title>Il Mistero di Ho-Oh</Card.Title>
          </Card.Body>
        </Card>
      </a>
      <a
        href="https://pokemongo.com/it/news"
        target="_blank"
        rel="noopener noreferrer"
        style={{ textDecoration: "none", color: "inherit" }}
      >
        <Card style={{ minWidth: "250px" }}>
          <Card.Img
            variant="top"
            src={torneo}
            alt="torneo"
            style={{ height: "150px", objectFit: "cover" }}
          />
          <Card.Body className="cardBodyStyle">
            <Card.Title>Nuovo torneo di pokemon</Card.Title>
          </Card.Body>
        </Card>
      </a>

      <div className="text-end">
        <Button
          variant="danger"
          href="https://ph.portal-pokemon.com/topics/?p=1   "
          target="_blank"
          className="fw-bold button-down"
        >
          Novità »
        </Button>
      </div>
    </div>
  </div>
);

export default ShowcaseSection;

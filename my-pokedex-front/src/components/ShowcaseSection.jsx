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
      📢 Latest Updates from the Pokémon World
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
            alt="new_generation"
            style={{ height: "150px", objectFit: "cover" }}
          />
          <Card.Body className="cardBodyStyle">
            <Card.Title>The New Generation</Card.Title>
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
            alt="Battles"
            style={{ height: "150px", objectFit: "cover" }}
          />
          <Card.Body className="cardBodyStyle">
            <Card.Title>Exciting Battles</Card.Title>
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
            <Card.Title>The Mystery of Ho-Oh</Card.Title>
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
            alt="Tournament"
            style={{ height: "150px", objectFit: "cover" }}
          />
          <Card.Body className="cardBodyStyle">
            <Card.Title>New Pokémon Tournament</Card.Title>
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
          News »
        </Button>
      </div>
    </div>
  </div>
);

export default ShowcaseSection;

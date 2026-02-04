import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Container,
  Row,
  Col,
  Card,
  ListGroup,
  ProgressBar,
  Alert,
  Spinner,
  Button,
} from "react-bootstrap";

const MAX_BASE_STAT = 255;

const formatId = (id) => String(id).padStart(3, "0");
const formatHeight = (dm) => `${(dm / 10).toFixed(1)} m`;
const formatDescription = (desc) => desc.replace(/\f/g, " ");

const PokemonDetails = () => {
  const { idPokemon } = useParams();
  const navigate = useNavigate();
  const [pokemonData, setPokemonData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isShiny, setIsShiny] = useState(false);

  const handleGoBackToPokedex = () => {
    navigate("/pokedex");
  };

  const fetchPokemonDetails = () => {
    const POKEMON_DETAIL_ENDPOINT = `https://mypokedex-1-fimv.onrender.com/pokemon/${idPokemon}`;

    let tokenString = localStorage.getItem("token");
    let finalToken = null;

    if (tokenString) {
      const match = tokenString.match(/'(.*?)'/);

      if (match && match[1]) {
        finalToken = match[1];
      } else {
        finalToken = tokenString.trim();
      }
    }

    console.log("Token Pulito Inviato:", finalToken);

    const requestOptions = {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        ...(finalToken ? { Authorization: `Bearer ${finalToken}` } : {}),
      },
    };

    setIsLoading(true);
    setError(null);

    fetch(POKEMON_DETAIL_ENDPOINT, requestOptions)
      .then((response) => {
        if (!response.ok) {
          throw new Error(
            `Errore ${response.status}: Unable to load Pokémon details.`,
          );
        }
        return response.json();
      })
      .then((data) => {
        setPokemonData(data);
      })
      .catch((err) => {
        console.error("Error loading Pokémon details:", err);
        setError("Loading failed. " + err.message);
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  useEffect(() => {
    if (idPokemon) {
      fetchPokemonDetails();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [idPokemon]);

  if (isLoading) {
    return (
      <Container className="text-center py-5" style={{ minHeight: "80vh" }}>
        <Spinner animation="border" variant="danger" />
        <p className="mt-2 text-secondary">Loading Pokémon details...</p>
      </Container>
    );
  }

  if (error || !pokemonData) {
    return (
      <Container className="text-center py-5" style={{ minHeight: "80vh" }}>
        <Alert variant="danger">
          {error || "Pokémon details not available."}
        </Alert>
      </Container>
    );
  }

  const types = [];
  if (pokemonData.type1) types.push(pokemonData.type1);
  if (pokemonData.type2) types.push(pokemonData.type2);

  const statsArray = [
    { name: "HP", value: pokemonData.stats.hp, variant: "success" },
    { name: "Attack", value: pokemonData.stats.attack, variant: "danger" },
    { name: "Defense", value: pokemonData.stats.defense, variant: "info" },
    {
      name: "Attack Sp.",
      value: pokemonData.stats.specialAttack,
      variant: "warning",
    },
    {
      name: "Defense Sp.",
      value: pokemonData.stats.specialDefense,
      variant: "primary",
    },
    { name: "Speed", value: pokemonData.stats.speed, variant: "secondary" },
  ];

  return (
    <div style={{ background: "#1a2234" }}>
      <Container className="py-5" style={{ minHeight: "80vh" }}>
        <div className="mb-4">
          <Button
            variant="outline-warning"
            onClick={handleGoBackToPokedex}
            style={{
              color: "#FFCB05",
              borderColor: "#FFCB05",
            }}
          >
            ← Return to Pokédex
          </Button>
        </div>
        <div className="pokedex-title-container">
          <div className="pokedex-title-shape">
            <h1 className="pokedex-title-text ">Pokedex</h1>
          </div>
        </div>
        <Row className="mb-4">
          <Col className="text-center">
            <h1 className="text-capitalize display-4 pb-2 text-white mt-4">
              {pokemonData.name}
              <span className=" fs-3 ms-2 text-white">
                #{formatId(pokemonData.idPokemon)}
              </span>
            </h1>
          </Col>
        </Row>

        <Row>
          <Col md={5} className="mb-4">
            <Card className="shadow-lg h-100 card-semitrasparente">
              <div className="p-4 text-center">
                <img
                  src={
                    isShiny ? pokemonData.spriteShinyUrl : pokemonData.spriteUrl
                  }
                  alt={pokemonData.name}
                  style={{ maxWidth: "250px", cursor: "pointer" }}
                  onClick={() => setIsShiny(!isShiny)}
                />
                <p className="mt-2 text-muted fst-italic">
                  Click on the image for the sprite{" "}
                  {isShiny ? "Normal" : "Shiny"}
                </p>
              </div>

              <Card.Body className="border-top">
                <p>
                  <strong className="me-2">Category:</strong>
                  {pokemonData.speciesCategory}
                </p>
                <p>
                  <strong className="me-2">Height:</strong>
                  {formatHeight(pokemonData.height)}
                </p>
                <div className="mb-3">
                  <strong className="me-2">Types:</strong>
                  {types.map((type) => (
                    <span
                      key={type.name}
                      className="text-capitalize me-1 badge d-inline-block text-capitalize px-2 py-1 rounded-pill"
                      style={{ backgroundColor: type.colorHex, color: "#FFF" }}
                    >
                      {type.name}
                    </span>
                  ))}
                </div>
                <Card.Text>
                  <strong className="d-block mb-1">Description:</strong>
                  {formatDescription(pokemonData.description)}
                </Card.Text>
              </Card.Body>
            </Card>
          </Col>

          <Col md={7} className="mb-4">
            <Card className="shadow-lg h-100 card-semitrasparente">
              <Card.Header className="fs-5 fw-bold">Base Stats</Card.Header>
              <ListGroup variant="flush">
                {statsArray.map((stat, index) => (
                  <ListGroup.Item
                    key={index}
                    className="d-flex align-items-center"
                  >
                    <span
                      className="fw-bold text-end"
                      style={{ width: "100px" }}
                    >
                      {stat.name}:
                    </span>
                    <span className="ms-3 me-2" style={{ width: "30px" }}>
                      {stat.value}
                    </span>
                    <ProgressBar
                      variant={stat.variant}
                      now={(stat.value / MAX_BASE_STAT) * 100}
                      className="flex-grow-1 "
                      label={`${stat.value}`}
                    />
                  </ListGroup.Item>
                ))}
                <ListGroup.Item className="text-end fw-bold">
                  Total Stats: {pokemonData.stats.totalStats}
                </ListGroup.Item>
              </ListGroup>

              <Card.Header className="fs-5 fw-bold mt-3">Abilities</Card.Header>
              <ListGroup variant="flush">
                {pokemonData.abilities.map((ability) => (
                  <ListGroup.Item key={ability.idAbility}>
                    <strong className="text-capitalize">{ability.name}:</strong>
                    <span className="ms-2">{ability.description}</span>
                  </ListGroup.Item>
                ))}
              </ListGroup>
            </Card>
          </Col>
        </Row>

        <Row className="mt-4">
          <Col>
            <Card className="shadow-lg card-semitrasparente">
              <Card.Header className="fs-5 fw-bold ">
                Learnable Moves ({pokemonData.learnableMoves.length})
              </Card.Header>

              <div className="p-3">
                <Row className="fw-bold text-white bg-dark d-none d-md-flex py-2 rounded">
                  <Col md={3}>Move Name</Col>
                  <Col md={1} className="text-center">
                    Power
                  </Col>
                  <Col md={2} className="text-center">
                    Accuracy
                  </Col>
                  <Col md={6}>Descrizione</Col>
                </Row>

                {pokemonData.learnableMoves.map((move, index) => (
                  <Row
                    key={move.idMove}
                    className={`py-2 border-bottom align-items-center ${
                      index % 2 === 1 ? "bg-light bg-opacity-10" : ""
                    }`}
                  >
                    <Col
                      xs={12}
                      md={3}
                      className="fw-bold text-capitalize mb-1 mb-md-0"
                    >
                      <span className="d-md-none me-2 text-muted">Move:</span>
                      {move.name}
                    </Col>

                    <Col xs={6} md={1} className="text-md-center">
                      <span className="d-md-none me-2 fw-bold">Power:</span>
                      {move.power || "—"}
                    </Col>
                    <Col xs={6} md={2} className="text-md-center">
                      <span className="d-md-none me-2 fw-bold">Accuracy:</span>
                      {move.accuracy || "—"}
                    </Col>
                    <Col xs={12} md={6} className="mt-2 mt-md-0">
                      <span className="d-md-none me-2 fw-bold d-block">
                        Description:
                      </span>
                      {move.description}
                    </Col>
                  </Row>
                ))}
              </div>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default PokemonDetails;

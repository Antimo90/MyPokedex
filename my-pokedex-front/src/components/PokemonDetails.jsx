import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  Container,
  Row,
  Col,
  Card,
  Badge,
  ListGroup,
  ProgressBar,
  Alert,
  Spinner,
} from "react-bootstrap";

const MAX_BASE_STAT = 255;

const formatId = (id) => String(id).padStart(3, "0");
const formatHeight = (dm) => `${(dm / 10).toFixed(1)} m`;
const formatDescription = (desc) => desc.replace(/\f/g, " ");

const PokemonDetails = () => {
  const { idPokemon } = useParams();

  const [pokemonData, setPokemonData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isShiny, setIsShiny] = useState(false);

  const fetchPokemonDetails = () => {
    const POKEMON_DETAIL_ENDPOINT = `http://localhost:3001/pokemon/${idPokemon}`;

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
            `Errore ${response.status}: Impossibile caricare i dettagli del Pokémon.`
          );
        }
        return response.json();
      })
      .then((data) => {
        setPokemonData(data);
      })
      .catch((err) => {
        console.error("Errore nel caricamento dei dettagli Pokémon:", err);
        setError("Caricamento fallito. " + err.message);
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
        <p className="mt-2 text-secondary">Caricamento dettagli Pokémon...</p>
      </Container>
    );
  }

  if (error || !pokemonData) {
    return (
      <Container className="text-center py-5" style={{ minHeight: "80vh" }}>
        <Alert variant="danger">
          {error || "Dettagli Pokémon non disponibili."}
        </Alert>
      </Container>
    );
  }

  const types = [];
  if (pokemonData.type1) types.push(pokemonData.type1);
  if (pokemonData.type2) types.push(pokemonData.type2);

  const statsArray = [
    { name: "HP", value: pokemonData.stats.hp, variant: "success" },
    { name: "Attacco", value: pokemonData.stats.attack, variant: "danger" },
    { name: "Difesa", value: pokemonData.stats.defense, variant: "info" },
    {
      name: "Attacco Sp.",
      value: pokemonData.stats.specialAttack,
      variant: "warning",
    },
    {
      name: "Difesa Sp.",
      value: pokemonData.stats.specialDefense,
      variant: "primary",
    },
    { name: "Velocità", value: pokemonData.stats.speed, variant: "secondary" },
  ];

  return (
    <Container className="py-5" style={{ minHeight: "80vh" }}>
      <Row className="mb-4">
        <Col>
          <h1 className="text-capitalize display-4 border-bottom pb-2">
            {pokemonData.name}
            <span className="text-muted fs-3 ms-2">
              #{formatId(pokemonData.idPokemon)}
            </span>
          </h1>
        </Col>
      </Row>

      <Row>
        <Col md={5} className="mb-4">
          <Card className="shadow-lg h-100">
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
                Clicca sull'immagine per lo sprite{" "}
                {isShiny ? "Normale" : "Shiny"}
              </p>
            </div>

            <Card.Body className="border-top">
              <p>
                <strong className="me-2">Categoria:</strong>
                {pokemonData.speciesCategory}
              </p>
              <p>
                <strong className="me-2">Altezza:</strong>
                {formatHeight(pokemonData.height)}
              </p>
              <div className="mb-3">
                <strong className="me-2">Tipi:</strong>
                {types.map((type) => (
                  <Badge
                    key={type.name}
                    className="text-capitalize me-1"
                    style={{ backgroundColor: type.colorHex, color: "#FFF" }}
                  >
                    {type.name}
                  </Badge>
                ))}
              </div>
              <Card.Text>
                <strong className="d-block mb-1">Descrizione:</strong>
                {formatDescription(pokemonData.description)}
              </Card.Text>
            </Card.Body>
          </Card>
        </Col>

        <Col md={7} className="mb-4">
          <Card className="shadow-lg h-100">
            <Card.Header className="fs-5 fw-bold">Statistiche Base</Card.Header>
            <ListGroup variant="flush">
              {statsArray.map((stat, index) => (
                <ListGroup.Item
                  key={index}
                  className="d-flex align-items-center"
                >
                  <span className="fw-bold text-end" style={{ width: "100px" }}>
                    {stat.name}:
                  </span>
                  <span className="ms-3 me-2" style={{ width: "30px" }}>
                    {stat.value}
                  </span>
                  <ProgressBar
                    variant={stat.variant}
                    now={(stat.value / MAX_BASE_STAT) * 100}
                    className="flex-grow-1"
                    label={`${stat.value}`}
                  />
                </ListGroup.Item>
              ))}
              <ListGroup.Item className="text-end fw-bold">
                Totale Statistiche: {pokemonData.stats.totalStats}
              </ListGroup.Item>
            </ListGroup>

            <Card.Header className="fs-5 fw-bold mt-3">Abilità</Card.Header>
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
          <Card className="shadow-lg">
            <Card.Header className="fs-5 fw-bold">
              Mosse Apprendibili ({pokemonData.learnableMoves.length})
            </Card.Header>
            <div className="table-responsive">
              <table className="table table-striped table-hover mb-0">
                <thead>
                  <tr>
                    <th>Nome Mossa</th>
                    <th>Potenza</th>
                    <th>Precisione</th>
                    <th>Descrizione</th>
                  </tr>
                </thead>
                <tbody>
                  {pokemonData.learnableMoves.map((move) => (
                    <tr key={move.idMove}>
                      <td className="fw-bold text-capitalize">{move.name}</td>
                      <td>{move.power || "—"}</td>
                      <td>{move.accuracy || "—"}</td>
                      <td>{move.description}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default PokemonDetails;

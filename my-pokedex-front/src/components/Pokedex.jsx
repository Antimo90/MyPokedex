import { useEffect, useState } from "react";
import { Container, Row, Col, Alert, Spinner, Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import PokemonCard from "./PokemonCard.jsx";

const POKEMON_API_ENDPOINT = "http://localhost:3001/pokemon?page=0&size=151";

const Pokedex = () => {
  const [pokemonList, setPokemonList] = useState([]);

  const [isLoading, setIsLoading] = useState(true);

  const [error, setError] = useState(null);

  const navigate = useNavigate();

  const fetchPokemon = () => {
    let token = localStorage.getItem("token");

    if (token && token.startsWith("{token:")) {
      token = token.split("'")[1];
      console.log("Token Pulito:", token);
    }

    const requestOptions = {
      method: "GET",
      headers: {
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        "Content-Type": "application/json",
      },
    };

    setIsLoading(true);
    setError(null);

    fetch(POKEMON_API_ENDPOINT, requestOptions)
      .then((response) => {
        if (!response.ok) {
          throw new Error(
            `Errore ${response.status}: Impossibile caricare i Pokémon.`
          );
        }
        return response.json();
      })
      .then((data) => {
        setPokemonList(data.content || data);
        console.log("JSON ricevuto dal Backend:", data);
      })
      .catch((err) => {
        console.error("Errore nel caricamento dei Pokémon:", err);

        setError("Caricamento fallito. " + err.message);
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  useEffect(() => {
    fetchPokemon();
  }, []);

  const handleGoBackToPokedex = () => {
    navigate("/");
  };

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
            ← Torna allla home
          </Button>
        </div>
        <div className="pokedex-title-container">
          <div className="pokedex-title-shape">
            <h1 className="pokedex-title-text">Pokedex</h1>
          </div>
        </div>
        <hr />

        {isLoading && (
          <div className="text-center mt-5">
            <Spinner
              animation="border"
              variant="danger"
              role="status"
              className="me-2"
            />
            <p className="lead text-secondary">Caricamento Pokémon...</p>
          </div>
        )}

        {error && (
          <Alert variant="danger" className="mt-4 text-center">
            {error}
          </Alert>
        )}

        {!isLoading && !error && pokemonList.length === 0 && (
          <Alert variant="info" className="mt-4 text-center">
            Nessun Pokémon trovato nel database.
          </Alert>
        )}

        <Row xs={2} sm={3} md={4} lg={5} xl={6} className="g-4 mt-3">
          {pokemonList.map((pokemon) => (
            <Col key={pokemon.idPokemon}>
              <PokemonCard pokemon={pokemon} />
            </Col>
          ))}
        </Row>
      </Container>
    </div>
  );
};

export default Pokedex;

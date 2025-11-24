import { useEffect, useState } from "react";
import { Container, Row, Col, Alert, Spinner } from "react-bootstrap";
import PokemonCardUser from "./PokemonCardUser.jsx";

const POKEMON_API_ENDPOINT = "http://localhost:3001/pokemon?page=0&size=151";
const COLLECTION_API_ENDPOINT = "http://localhost:3001/users/me/collection";

const getToken = () => {
  let token = localStorage.getItem("token");
  if (token && typeof token === "string" && token.startsWith("{token:")) {
    try {
      const match = token.match(/'([^']+)'/);
      return match ? match[1] : null;
    } catch (e) {
      console.error("Errore nel parsing del token:", e);
      return null;
    }
  }
  return token;
};

const PokedexUser = () => {
  const [pokemonList, setPokemonList] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedIds, setSelectedIds] = useState([]);

  const togglePokemonSelection = (id) => {
    setSelectedIds((prevIds) => {
      if (prevIds.includes(id)) {
        return prevIds.filter((pokemonId) => pokemonId !== id);
      } else {
        return [...prevIds, id];
      }
    });
  };

  const fetchUserCollection = () => {
    const token = getToken();
    if (!token) {
      console.log("Utente non loggato, la collezione non verrà caricata.");
      return;
    }

    const requestOptions = {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    };

    fetch(COLLECTION_API_ENDPOINT, requestOptions)
      .then((response) => {
        if (!response.ok) {
          throw new Error(
            `Errore ${response.status}: Impossibile caricare la collezione.`
          );
        }

        return response.json();
      })
      .then((data) => {
        const capturedIds = data
          .filter((up) => up.isCaptured)
          .map((up) => up.pokemon.idPokemon);

        setSelectedIds(capturedIds);
        console.log("Collezione caricata:", capturedIds);
      })
      .catch((err) => {
        console.error("Errore nel caricamento della collezione:", err);
      });
  };

  const fetchPokemon = () => {
    const token = getToken();

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
      })
      .catch((err) => {
        console.error("Errore nel caricamento dei Pokémon:", err);
        setError("Caricamento fallito. " + err.message);
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  const handleCaptureToggle = (pokemonId, shouldCapture) => {
    const token = getToken();
    if (!token) {
      alert("Devi effettuare l'accesso per catturare Pokémon.");
      return;
    }

    const method = shouldCapture ? "POST" : "DELETE";
    const payload = {
      pokemonId: pokemonId,
      isShiny: false,
    };

    fetch(COLLECTION_API_ENDPOINT, {
      method: method,
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    })
      .then((response) => {
        if (!response.ok) {
          if (response.status !== 204) {
            return response.json().then((errorData) => {
              throw new Error(
                errorData.message ||
                  `Errore API: ${response.status} ${response.statusText}`
              );
            });
          }
        }

        return null;
      })
      .then(() => {
        togglePokemonSelection(pokemonId);
      })
      .catch((error) => {
        console.error("Errore nell'API Collection:", error);
        alert(error.message);
      });
  };

  useEffect(() => {
    fetchPokemon();
    fetchUserCollection();
  }, []);

  return (
    <div style={{ background: "#1a2234" }}>
      <Container className="py-5" style={{ minHeight: "80vh" }}>
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
              <PokemonCardUser
                pokemon={pokemon}
                onCaptureToggle={handleCaptureToggle}
                isSelected={selectedIds.includes(pokemon.idPokemon)}
              />
            </Col>
          ))}
        </Row>
      </Container>
    </div>
  );
};

export default PokedexUser;

import { useEffect, useState } from "react";
import { Container, Row, Col, Alert, Spinner, Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import PokemonCard from "./PokemonCard.jsx";

// Endpoint API per recuperare la lista di Pokémon
const POKEMON_API_ENDPOINT =
  "https://mypokedex-1-fimv.onrender.com/pokemon?page=0&size=151";

const Pokedex = () => {
  // Stato per memorizzare l'elenco dei Pokémon
  const [pokemonList, setPokemonList] = useState([]);

  // Stato per indicare se l'API è in fase di caricamento
  const [isLoading, setIsLoading] = useState(true);

  // Stato per memorizzare eventuali errori di fetch
  const [error, setError] = useState(null);

  // Hook per gestire la navigazione programmatica (es. pulsante "Torna a casa")
  const navigate = useNavigate();

  // Funzione per effettuare la chiamata API e recuperare i dati dei Pokémon
  const fetchPokemon = () => {
    let token = localStorage.getItem("token"); // Recupera il token da localStorage

    // Logica specifica per pulire il token se è stato memorizzato con un prefisso o formato inatteso.
    // Questo è un work-around per un potenziale problema di memorizzazione.
    if (token && token.startsWith("{token:")) {
      // Assume che il token sia del formato {token: 'VALORE_TOKEN'}
      token = token.split("'")[1];
      console.log("Token Pulito:", token);
    }

    // Opzioni della richiesta HTTP, inclusi gli header per l'autenticazione
    const requestOptions = {
      method: "GET",
      headers: {
        // Aggiunge l'header Authorization solo se il token è presente
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        "Content-Type": "application/json",
      },
    };

    setIsLoading(true); // Imposta il caricamento a true prima della fetch
    setError(null); // Resetta eventuali errori precedenti

    fetch(POKEMON_API_ENDPOINT, requestOptions)
      .then((response) => {
        if (!response.ok) {
          // Lancia un errore se la risposta HTTP non è 2xx
          throw new Error(`Errore ${response.status}: Unable to load Pokémon.`);
        }
        return response.json(); // Parsa il corpo della risposta in JSON
      })
      .then((data) => {
        // Si aspetta che la lista sia in `data.content` o direttamente in `data`
        setPokemonList(data.content || data);
        console.log("JSON ricevuto dal Backend:", data);
      })
      .catch((err) => {
        console.error("Error loading Pokémon:", err);

        // Aggiorna lo stato di errore per la visualizzazione
        setError("Loading failed. " + err.message);
      })
      .finally(() => {
        setIsLoading(false); // Imposta il caricamento a false al termine della richiesta
      });
  };

  // useEffect per eseguire la fetch una sola volta al montaggio del componente
  useEffect(() => {
    fetchPokemon();
  }, []); // Dipendenza vuota: si esegue solo al mount

  // Gestore del click per tornare alla pagina principale
  const handleGoBackToPokedex = () => {
    navigate("/"); // Naviga alla root
  };

  return (
    // Contenitore principale con sfondo scuro
    <div style={{ background: "#1a2234" }}>
      <Container className="py-5" style={{ minHeight: "80vh" }}>
        {/* Pulsante per tornare alla Home */}
        <div className="mb-4">
          <Button
            variant="outline-warning"
            onClick={handleGoBackToPokedex}
            style={{
              color: "#FFCB05",
              borderColor: "#FFCB05",
            }}
          >
            ← Go back to home
          </Button>
        </div>

        {/* Titolo Pokedex (con classi CSS esterne non definite qui) */}
        <div className="pokedex-title-container">
          <div className="pokedex-title-shape">
            <h1 className="pokedex-title-text">Pokedex</h1>
          </div>
        </div>
        <hr />

        {/* Visualizzazione Caricamento (Spinner) */}
        {isLoading && (
          <div className="text-center mt-5">
            <Spinner
              animation="border"
              variant="danger"
              role="status"
              className="me-2"
            />
            <p className="lead text-secondary">Loading Pokémon...</p>
          </div>
        )}

        {/* Visualizzazione Errore */}
        {error && (
          <Alert variant="danger" className="mt-4 text-center">
            {error}
          </Alert>
        )}

        {/* Visualizzazione Lista Vuota */}
        {!isLoading && !error && pokemonList.length === 0 && (
          <Alert variant="info" className="mt-4 text-center">
            No Pokémon found in the database.
          </Alert>
        )}

        {/* Griglia dei Pokémon */}
        <Row xs={2} sm={3} md={4} lg={5} xl={6} className="g-4 mt-3">
          {pokemonList.map((pokemon) => (
            <Col key={pokemon.idPokemon}>
              {/* Rendering della singola Card per Pokémon */}
              <PokemonCard pokemon={pokemon} />
            </Col>
          ))}
        </Row>
      </Container>
    </div>
  );
};

export default Pokedex;

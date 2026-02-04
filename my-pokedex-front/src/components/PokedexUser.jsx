import { useEffect, useState } from "react";
import { Container, Row, Col, Alert, Spinner, Button } from "react-bootstrap";
import { useNavigate, useLocation } from "react-router-dom";
import PokemonCardUser from "./PokemonCardUser.jsx";

// Definisco gli endpoint API principali
const POKEMON_API_ENDPOINT =
  "https://mypokedex-1-fimv.onrender.com/pokemon?page=0&size=151";
const COLLECTION_API_ENDPOINT =
  "https://mypokedex-1-fimv.onrender.com/users/me/collection";
const PROFILE_API_ENDPOINT = "https://mypokedex-1-fimv.onrender.com/users/me";

const getToken = () => {
  let token = localStorage.getItem("token");
  // Questa è una sanitizzazione/correzione del token, nel caso in cui sia stato salvato in modo strano
  if (token && typeof token === "string" && token.startsWith("{token:")) {
    try {
      // Cerco di estrarre il valore del token corretto
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
  // Stato per conservare la lista di tutti i Pokémon
  const [pokemonList, setPokemonList] = useState([]);
  // Stato per gestire il caricamento
  const [isLoading, setIsLoading] = useState(true);
  // Stato per gestire eventuali messaggi di errore
  const [error, setError] = useState(null);
  // Stato array di ID dei Pokémon che l'utente ha catturato
  const [selectedIds, setSelectedIds] = useState([]);
  // Stato per memorizzare lo username dell'utente
  const [username, setUsername] = useState(null);
  // Stato per memorizzare l'URL dell'avatar
  const [avatarUrl, setAvatarUrl] = useState(null);
  // Hook per la navigazione programmatica
  const navigate = useNavigate();
  // Hook per ottenere l'oggetto 'location'
  const location = useLocation();
  // Estraggo i query params dalla URL
  const queryParams = new URLSearchParams(location.search);
  const searchQuery = queryParams.get("q");

  // Funzione per aggiungere/rimuovere un ID dall'array dei selezionati
  const togglePokemonSelection = (id) => {
    setSelectedIds((prevIds) => {
      if (prevIds.includes(id)) {
        // Se è già presente, lo rimuovo
        return prevIds.filter((pokemonId) => pokemonId !== id);
      } else {
        // Altrimenti, lo aggiungo
        return [...prevIds, id];
      }
    });
  };

  // Funzione per caricare i dati del profilo utente
  const fetchUserProfile = () => {
    const token = getToken();
    if (!token) {
      return; // Non procedo se non c'è il token
    }
    // Opzioni per la richiesta GET, includendo l'autorizzazione Bearer
    const requestOptions = {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    };

    fetch(PROFILE_API_ENDPOINT, requestOptions)
      .then((response) => {
        if (!response.ok) {
          // Se la risposta non è OK, lancio un errore
          throw new Error(`Errore ${response.status}: Unable to load profile.`);
        }
        return response.json();
      })
      .then((data) => {
        // Aggiorno gli stati con i dati del profilo
        setUsername(data.username);
        setAvatarUrl(data.avatarUrl);
      })
      .catch((err) => {
        console.error("Error loading user profile:", err);
      });
  };

  // Funzione per caricare la collezione (i Pokémon catturati) dell'utente
  const fetchUserCollection = () => {
    const token = getToken();
    if (!token) {
      console.log("User not logged in, the collection will not be loaded.");
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
            `Errore ${response.status}: Unable to load collection.`,
          );
        }
        return response.json();
      })
      .then((data) => {
        // Estraggo solo gli ID dei Pokémon dalla risposta
        const capturedIds = data.map((up) => up.pokemon.idPokemon);
        setSelectedIds(capturedIds); // Imposto gli ID caricati come selezionati
        console.log("Collection loaded FINAL:", capturedIds);
      })
      .catch((err) => {
        console.error("Error loading collection:", err);
      });
  };

  // Funzione per caricare la lista completa dei Pokémon dal database
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
          throw new Error(`Errore ${response.status}: Unable to load Pokémon.`);
        }
        return response.json();
      })
      .then((data) => {
        setPokemonList(data.content || data);
      })
      .catch((err) => {
        console.error("Error loading Pokémon:", err);
        setError("Loading failed. " + err.message);
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  // Funzione per catturare o rilasciare un Pokémon tramite API
  const handleCaptureToggle = (pokemonId, shouldCapture) => {
    const token = getToken();
    if (!token) {
      // Blocco se l'utente non è loggato
      alert("You must log in to catch Pokémon.");
      return;
    }
    // Se shouldCapture è true uso POST (Cattura), altrimenti DELETE (Rilascio)
    const method = shouldCapture ? "POST" : "DELETE";
    // Payload per la richiesta (assumo isShiny: false per ora)
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
      // Invio il payload solo se non è una DELETE
      body: JSON.stringify(payload),
    })
      .then((response) => {
        if (!response.ok) {
          // La DELETE (rilascio) di successo spesso torna 204 No Content
          if (response.status !== 204) {
            return response.json().then((errorData) => {
              throw new Error(
                errorData.message ||
                  `Error API: ${response.status} ${response.statusText}`,
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
        console.error("Collection API Error:", error);
        alert(`Unable to update the collection: ${error.message}`);
      });
  };

  // useEffect per eseguire le chiamate API al montaggio del componente
  useEffect(() => {
    fetchPokemon();
    fetchUserCollection();
    fetchUserProfile();
  }, []);

  // Funzione per reindirizzare alla pagina delle impostazioni
  const handleSettingsClick = () => {
    navigate("/setting");
  };

  // Funzione per il Log Out
  const handleLogoutClick = () => {
    localStorage.removeItem("token");
    setUsername(null);
    setAvatarUrl(null);
    setPokemonList([]);
    navigate("/");
  };

  // Logica di filtraggio: se c'è una ricerca (searchQuery), filtro la lista
  const displayedPokemons = searchQuery
    ? pokemonList.filter(
        (pokemon) =>
          pokemon.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          String(pokemon.idPokemon) === searchQuery.trim(),
      )
    : pokemonList;

  return (
    <div style={{ background: "#1a2234" }}>
      <Container className="py-5" style={{ minHeight: "80vh" }}>
        <div className="pokedex-title-container">
          <div className="pokedex-title-shape">
            <h1 className="pokedex-title-text">
              {username && `Welcome ${username} in your Pokédex!`}
            </h1>
          </div>
        </div>
        {username && (
          <Row className="align-items-center mb-3 mt-5">
            <Col xs={6} className="d-flex justify-content-start">
              <div className="d-flex flex-column align-items-center">
                {avatarUrl && (
                  <img
                    src={avatarUrl}
                    alt={`${username}'s Avatar`}
                    style={{
                      width: "100px",
                      height: "100px",
                      borderRadius: "50%",
                      objectFit: "cover",
                      marginBottom: "5px",
                      border: "4px solid #ff4500",
                    }}
                  />
                )}
                <span className="text-light fw-bold">{username}</span>
              </div>
            </Col>
            <Col xs={6} className="d-flex justify-content-end">
              <Button
                variant="danger"
                onClick={handleSettingsClick}
                style={{ borderColor: "#ff4500", color: "#efe9e7ff" }}
              >
                ⚙️ Settings
              </Button>
              <Button
                variant="danger"
                onClick={handleLogoutClick}
                className="ms-2"
                style={{ borderColor: "#ff4500", color: "#efe9e7ff" }}
              >
                Log Out
              </Button>
            </Col>
          </Row>
        )}

        {searchQuery && (
          <Alert variant="warning" className="text-center mt-3">
            Search results for: **"{searchQuery}"**{" "}
            <Button
              variant="link"
              onClick={() => navigate("/pokedex", { replace: true })}
              className="p-0 ms-2 text-decoration-none"
            >
              (Cancel)
            </Button>
          </Alert>
        )}

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

        {error && (
          <Alert variant="danger" className="mt-4 text-center">
            {error}
          </Alert>
        )}

        {!isLoading && !error && displayedPokemons.length === 0 && (
          <Alert variant="info" className="mt-4 text-center">
            {searchQuery
              ? `No Pokémon found for "${searchQuery}". Try another name!`
              : "No Pokémon found in the database."}
          </Alert>
        )}

        <Row xs={2} sm={3} md={4} lg={5} xl={6} className="g-4 mt-3">
          {displayedPokemons.map((pokemon) => (
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

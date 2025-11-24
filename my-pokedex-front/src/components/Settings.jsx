import { useState, useEffect } from "react";
import {
  Container,
  Form,
  Button,
  Row,
  Col,
  Alert,
  Spinner,
  Card,
} from "react-bootstrap";

const PROFILE_API_ENDPOINT = "http://localhost:3001/users/me";

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

const Settings = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  const [currentUsername, setCurrentUsername] = useState("");
  const [currentEmail, setCurrentEmail] = useState("");
  const [newUsername, setNewUsername] = useState("");
  const [newEmail, setNewEmail] = useState("");
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  const [isPasswordUpdating, setIsPasswordUpdating] = useState(false);
  const [currentAvatarUrl, setCurrentAvatarUrl] = useState(null);
  const [currentAvatarId, setCurrentAvatarId] = useState(null);
  const [allPokemon, setAllPokemon] = useState([]);
  const [selectedAvatarId, setSelectedAvatarId] = useState(null);
  const [isAvatarUpdating, setIsAvatarUpdating] = useState(false);
  const [isShiny, setIsShiny] = useState(false);

  const POKEMON_API_ENDPOINT = "http://localhost:3001/pokemon?page=0&size=151";

  const fetchUserProfile = () => {
    const token = getToken();
    if (!token) {
      setError("Autenticazione richiesta. Token non trovato.");
      setIsLoading(false);
      return;
    }

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
          throw new Error(
            `Errore ${response.status}: Impossibile caricare il profilo.`
          );
        }
        return response.json();
      })
      .then((data) => {
        setCurrentUsername(data.username);
        setCurrentEmail(data.email);

        setNewUsername(data.username);
        setNewEmail(data.email);
        setCurrentAvatarUrl(data.avatarUrl);
      })
      .catch((err) => {
        console.error("Errore nel caricamento del profilo utente:", err);
        setError(err.message);
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  const fetchAllPokemon = () => {
    fetch(POKEMON_API_ENDPOINT)
      .then((response) => {
        if (!response.ok)
          throw new Error("Impossibile caricare i Pokémon per l'avatar.");
        return response.json();
      })
      .then((data) => {
        setAllPokemon(data.content || data);
      })
      .catch((err) => {
        console.error("Errore caricamento lista Pokémon:", err);
      });
  };

  useEffect(() => {
    fetchUserProfile();
    fetchAllPokemon();
  }, []);

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    setSuccessMessage(null);
    setError(null);

    const token = getToken();
    if (!token) {
      setError("Token di autenticazione mancante.");
      return;
    }

    const body = {
      username: newUsername,
      email: newEmail,
    };

    try {
      const response = await fetch(PROFILE_API_ENDPOINT, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(body),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData.message ||
            `Errore ${response.status}: Impossibile aggiornare il profilo.`
        );
      }

      const updatedUser = await response.json();

      setCurrentUsername(updatedUser.username);
      setCurrentEmail(updatedUser.email);
      setNewUsername(updatedUser.username);
      setNewEmail(updatedUser.email);

      setSuccessMessage("Profilo aggiornato con successo!");
    } catch (err) {
      console.error("Errore aggiornamento profilo:", err);
      setError(err.message || "Aggiornamento fallito.");
    }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    setSuccessMessage(null);
    setError(null);
    setIsPasswordUpdating(true);

    const token = getToken();
    if (!token) {
      setError("Token di autenticazione mancante.");
      setIsPasswordUpdating(false);
      return;
    }

    if (newPassword !== confirmNewPassword) {
      setError("La nuova password e la conferma non corrispondono.");
      setIsPasswordUpdating(false);
      return;
    }

    const body = {
      oldPassword: oldPassword,
      newPassword: newPassword,
    };

    try {
      const response = await fetch(PROFILE_API_ENDPOINT + "/password", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(body),
      });

      if (response.status === 204) {
        setSuccessMessage("Password aggiornata con successo!");

        setOldPassword("");
        setNewPassword("");
        setConfirmNewPassword("");
      } else {
        const errorData = await response.json();
        throw new Error(
          errorData.message ||
            `Errore ${response.status}: Impossibile cambiare password.`
        );
      }
    } catch (err) {
      console.error("Errore cambio password:", err);
      setError(err.message || "Aggiornamento password fallito.");
    } finally {
      setIsPasswordUpdating(false);
    }
  };

  const handleAvatarUpdate = async (e) => {
    e.preventDefault();
    setSuccessMessage(null);
    setError(null);
    setIsAvatarUpdating(true);

    const token = getToken();
    if (!token) {
      setError("Token di autenticazione mancante.");
      setIsAvatarUpdating(false);
      return;
    }

    if (selectedAvatarId === currentAvatarId) {
      setSuccessMessage("Avatar già impostato su questo Pokémon.");
      setIsAvatarUpdating(false);
      return;
    }

    const body = {
      pokemonId: selectedAvatarId,
      isShiny: isShiny,
    };

    try {
      const response = await fetch(PROFILE_API_ENDPOINT + "/avatar", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(body),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData.message ||
            `Errore ${response.status}: Impossibile aggiornare l'avatar.`
        );
      }

      const updatedUser = await response.json();

      setCurrentAvatarUrl(updatedUser.avatarUrl);

      const match = updatedUser.avatarUrl.match(/\/(\d+)\.png$/);
      setCurrentAvatarId(match ? parseInt(match[1], 10) : selectedAvatarId);

      setSuccessMessage("Avatar aggiornato con successo!");
    } catch (err) {
      console.error("Errore aggiornamento avatar:", err);
      setError(err.message || "Aggiornamento avatar fallito.");
    } finally {
      setIsAvatarUpdating(false);
    }
  };

  if (isLoading) {
    return (
      <div className="text-center mt-5">
        <Spinner animation="border" variant="danger" />
        <p className="text-secondary mt-2">Caricamento impostazioni...</p>
      </div>
    );
  }

  if (error && !successMessage) {
    return (
      <Container className="py-5">
        <Alert variant="danger" className="text-center">
          {error}
        </Alert>
      </Container>
    );
  }

  return (
    <div
      style={{ background: "#1a2234", color: "#f8f9fa", minHeight: "100vh" }}
    >
      <Container className="py-5">
        <h2 className="mb-4 text-center" style={{ color: "#FFCB05" }}>
          ⚙️ Impostazioni Utente
        </h2>
        <hr style={{ borderColor: "#FFCB05" }} />

        {successMessage && (
          <Alert variant="success" className="mb-4">
            {successMessage}
          </Alert>
        )}
        {error && (
          <Alert variant="danger" className="mb-4">
            {error}
          </Alert>
        )}

        <Row className="justify-content-center">
          <Col md={8} lg={6} className="mb-4">
            <Card
              className="p-4"
              style={{
                backgroundColor: "#212a3b",
                border: "1px solid #3e4c63",
              }}
            >
              <h4 className="mb-3" style={{ color: "#FFCB05" }}>
                Modifica Username ed Email
              </h4>
              <Form onSubmit={handleProfileUpdate}>
                <Form.Group className="mb-3">
                  <Form.Label
                    style={{
                      color: "#f8f9fa",
                      borderColor: "#495057",
                    }}
                  >
                    Username attuale: **{currentUsername}**
                  </Form.Label>
                  <Form.Control
                    type="text"
                    value={newUsername}
                    onChange={(e) => setNewUsername(e.target.value)}
                    required
                    style={{
                      backgroundColor: "#1a2234",
                      color: "#f8f9fa",
                      borderColor: "#495057",
                    }}
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label
                    style={{
                      color: "#f8f9fa",
                      borderColor: "#495057",
                    }}
                  >
                    Email attuale: **{currentEmail}**
                  </Form.Label>
                  <Form.Control
                    type="email"
                    value={newEmail}
                    onChange={(e) => setNewEmail(e.target.value)}
                    required
                    style={{
                      backgroundColor: "#1a2234",
                      color: "#f8f9fa",
                      borderColor: "#495057",
                    }}
                  />
                </Form.Group>

                <Button variant="danger" type="submit" className="mt-2 w-100">
                  Salva Profilo
                </Button>
              </Form>
            </Card>
          </Col>

          <Col md={8} lg={6} className="mb-4">
            <Card
              className="p-4"
              style={{
                backgroundColor: "#212a3b",
                border: "1px solid #3e4c63",
              }}
            >
              <h4 className="mb-3" style={{ color: "#FFCB05" }}>
                Cambia Password
              </h4>
              <Form onSubmit={handleChangePassword}>
                <Form.Group className="mb-3">
                  <Form.Label
                    style={{
                      color: "#f8f9fa",
                      borderColor: "#495057",
                    }}
                  >
                    Password Attuale
                  </Form.Label>
                  <Form.Control
                    type="password"
                    value={oldPassword}
                    onChange={(e) => setOldPassword(e.target.value)}
                    required
                    style={{
                      backgroundColor: "#1a2234",
                      color: "#f8f9fa",
                      borderColor: "#495057",
                    }}
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label
                    style={{
                      color: "#f8f9fa",
                      borderColor: "#495057",
                    }}
                  >
                    Nuova Password
                  </Form.Label>
                  <Form.Control
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    required
                    minLength={8}
                    style={{
                      backgroundColor: "#1a2234",
                      color: "#f8f9fa",
                      borderColor: "#495057",
                    }}
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label
                    style={{
                      color: "#f8f9fa",
                      borderColor: "#495057",
                    }}
                  >
                    Conferma Nuova Password
                  </Form.Label>
                  <Form.Control
                    type="password"
                    value={confirmNewPassword}
                    onChange={(e) => setConfirmNewPassword(e.target.value)}
                    required
                    style={{
                      backgroundColor: "#1a2234",
                      color: "#f8f9fa",
                      borderColor: "#495057",
                    }}
                  />
                </Form.Group>

                <Button
                  variant="danger"
                  type="submit"
                  className="mt-2 w-100"
                  disabled={isPasswordUpdating}
                >
                  {isPasswordUpdating ? (
                    <Spinner animation="border" size="sm" className="me-2" />
                  ) : (
                    "Aggiorna Password"
                  )}
                </Button>
              </Form>
            </Card>
          </Col>

          <Col md={8} lg={6} className="mb-4">
            <Card
              className="p-4"
              style={{
                backgroundColor: "#212a3b",
                border: "1px solid #3e4c63",
              }}
            >
              <h4 className="mb-3" style={{ color: "#FFCB05" }}>
                Modifica Avatar
              </h4>
              <Form onSubmit={handleAvatarUpdate}>
                <div className="text-center mb-3">
                  {currentAvatarUrl && (
                    <img
                      src={currentAvatarUrl}
                      alt="Avatar attuale"
                      style={{
                        width: "120px",
                        height: "120px",
                        borderRadius: "50%",
                        objectFit: "cover",
                        border: "4px solid #FFCB05",
                        marginBottom: "10px",
                      }}
                    />
                  )}
                  <p
                    className=" mb-1"
                    style={{
                      color: "#f8f9fa",
                      borderColor: "#495057",
                    }}
                  >
                    Avatar attuale (ID: {currentAvatarId})
                  </p>
                </div>

                <Form.Group className="mb-3">
                  <Form.Label
                    style={{
                      color: "#f8f9fa",
                      borderColor: "#495057",
                    }}
                  >
                    Seleziona Nuovo Avatar (Pokémon)
                  </Form.Label>
                  <Form.Select
                    value={selectedAvatarId || ""}
                    onChange={(e) =>
                      setSelectedAvatarId(parseInt(e.target.value))
                    }
                    required
                    disabled={allPokemon.length === 0 || isAvatarUpdating}
                    style={{
                      backgroundColor: "#1a2234",
                      color: "#f8f9fa",
                      borderColor: "#495057",
                    }}
                  >
                    <option value="" disabled>
                      Scegli un Pokémon
                    </option>
                    {allPokemon.map((p) => (
                      <option key={p.idPokemon} value={p.idPokemon}>
                        {p.idPokemon}. {p.name}
                      </option>
                    ))}
                  </Form.Select>
                </Form.Group>
                <Form.Group className="mb-3" controlId="formShinyAvatar">
                  <Form.Check
                    type="checkbox"
                    label="Versione Shiny ✨"
                    checked={isShiny}
                    onChange={(e) => setIsShiny(e.target.checked)}
                    disabled={isAvatarUpdating}
                    style={{ color: "#f8f9fa" }}
                  />
                </Form.Group>

                <Button
                  variant="danger"
                  type="submit"
                  className="mt-2 w-100"
                  disabled={isAvatarUpdating || allPokemon.length === 0}
                >
                  {isAvatarUpdating ? (
                    <Spinner animation="border" size="sm" className="me-2" />
                  ) : (
                    "Aggiorna Avatar"
                  )}
                </Button>
              </Form>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default Settings;

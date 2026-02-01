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
import { useNavigate } from "react-router-dom";

const PROFILE_API_ENDPOINT = "https://mypokedex-axtn.onrender.com/users/me";
const POKEMON_API_ENDPOINT =
  "https://mypokedex-axtn.onrender.com/pokemon?page=0&size=151";

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
  const [error, setError] = useState(null); // Errore generale
  const [successMessage, setSuccessMessage] = useState(null);

  // Stati per Dati Utente
  const [currentUsername, setCurrentUsername] = useState("");
  const [currentEmail, setCurrentEmail] = useState("");
  const [newUsername, setNewUsername] = useState("");
  const [newEmail, setNewEmail] = useState("");

  // Stati per Cambio Password
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  const [isPasswordUpdating, setIsPasswordUpdating] = useState(false);
  const [passwordError, setPasswordError] = useState(null); // << NOVITÀ: Errore specifico per la password

  // Stati per Avatar
  const [currentAvatarUrl, setCurrentAvatarUrl] = useState(null);
  const [currentAvatarId, setCurrentAvatarId] = useState(null);
  const [allPokemon, setAllPokemon] = useState([]);
  const [selectedAvatarId, setSelectedAvatarId] = useState(null);
  const [isAvatarUpdating, setIsAvatarUpdating] = useState(false);
  const [isShiny, setIsShiny] = useState(false);

  const navigate = useNavigate();

  const fetchUserProfile = () => {
    const token = getToken();
    if (!token) {
      setError("Authentication required. Token not found.");
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
          throw new Error(`Errore ${response.status}: Unable to load profile.`);
        }
        return response.json();
      })
      .then((data) => {
        setCurrentUsername(data.username);
        setCurrentEmail(data.email);
        setNewUsername(data.username);
        setNewEmail(data.email);
        setCurrentAvatarUrl(data.avatarUrl);
        // Tenta di estrarre l'ID dal URL
        const match = data.avatarUrl?.match(/\/(\d+)\.png$/);
        if (match) {
          setCurrentAvatarId(parseInt(match[1], 10));
          setSelectedAvatarId(parseInt(match[1], 10));
        } else {
          setCurrentAvatarId(null);
          setSelectedAvatarId(null);
        }
      })
      .catch((err) => {
        console.error("Error loading user profile:", err);
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
          throw new Error("Unable to load Pokémon for the avatar.");
        return response.json();
      })
      .then((data) => {
        setAllPokemon(data.content || data);
      })
      .catch((err) => {
        console.error("Error loading Pokémon list:", err);
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
    setPasswordError(null); // Pulisce errore password se si cambia sezione

    const token = getToken();
    if (!token) {
      setError("Missing authentication token.");
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
            `Errore ${response.status}: Unable to update profile.`,
        );
      }

      const updatedUser = await response.json();

      setCurrentUsername(updatedUser.username);
      setCurrentEmail(updatedUser.email);
      setNewUsername(updatedUser.username);
      setNewEmail(updatedUser.email);

      setSuccessMessage("Profile updated successfully!");
    } catch (err) {
      console.error("Profile update error:", err);
      setError(err.message || "Update failed.");
    }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    setSuccessMessage(null);
    setError(null);
    setPasswordError(null); // Pulisce l'errore precedente
    setIsPasswordUpdating(true);

    const token = getToken();
    if (!token) {
      setError("Missing authentication token.");
      setIsPasswordUpdating(false);
      return;
    }

    if (newPassword !== confirmNewPassword) {
      setPasswordError("The new password and confirmation do not match.");
      setIsPasswordUpdating(false);
      setOldPassword("");
      setNewPassword("");
      setConfirmNewPassword("");
      return; // Blocca l'esecuzione e mostra l'errore localizzato
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
        setSuccessMessage("Password updated successfully!");

        // Pulisce i campi al successo
        setOldPassword("");
        setNewPassword("");
        setConfirmNewPassword("");
      } else {
        const errorData = await response.json();
        const errorMessage =
          errorData.message ||
          `Errore ${response.status}: Unable to change password.`;
        setPasswordError(errorMessage);
        console.error("API Error:", errorMessage);
      }
    } catch (err) {
      console.error("Password change error:", err);
      setPasswordError(err.message || "Password update failed.");
    } finally {
      setIsPasswordUpdating(false);
    }
  };

  const handleAvatarUpdate = async (e) => {
    e.preventDefault();
    setSuccessMessage(null);
    setError(null);
    setPasswordError(null);
    setIsAvatarUpdating(true);

    const token = getToken();
    if (!token) {
      setError("Missing authentication token.");
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
            `Errore ${response.status}: Unable to update avatar.`,
        );
      }

      const updatedUser = await response.json();

      setCurrentAvatarUrl(updatedUser.avatarUrl);

      // Aggiorna l'ID corrente
      const match = updatedUser.avatarUrl.match(/\/(\d+)\.png$/);
      setCurrentAvatarId(match ? parseInt(match[1], 10) : selectedAvatarId);

      setSuccessMessage("Avatar updated successfully!");
    } catch (err) {
      console.error("Errore aggiornamento avatar:", err);
      setError(err.message || "Avatar update failed.");
    } finally {
      setIsAvatarUpdating(false);
    }
  };

  if (isLoading) {
    return (
      <div className="text-center mt-5">
        <Spinner animation="border" variant="danger" />
        <p className="text-secondary mt-2">Loading settings...</p>
      </div>
    );
  }

  // L'errore generale lo mostriamo solo se non c'è un messaggio di successo
  if (error && !successMessage) {
    return (
      <Container className="py-5">
        <Alert variant="danger" className="text-center">
          {error}
        </Alert>
      </Container>
    );
  }

  const handleGoBackToPokedex = () => {
    navigate("/pokedex");
  };

  return (
    <div
      style={{ background: "#1a2234", color: "#f8f9fa", minHeight: "100vh" }}
    >
      <Container className="py-5">
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
        <h2 className="mb-4 text-center" style={{ color: "#FFCB05" }}>
          ⚙️ User Settings
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
                Change Username and Email
              </h4>
              <Form onSubmit={handleProfileUpdate}>
                <Form.Group className="mb-3">
                  <Form.Label
                    style={{
                      color: "#f8f9fa",
                      borderColor: "#495057",
                    }}
                  >
                    Current Username: {currentUsername}
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
                    Current Email: {currentEmail}
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
                  Save Profile
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
                Change Password
              </h4>

              {passwordError && (
                <Alert variant="danger" className="mb-3">
                  {passwordError}
                </Alert>
              )}

              <Form onSubmit={handleChangePassword}>
                <Form.Group className="mb-3">
                  <Form.Label
                    style={{
                      color: "#f8f9fa",
                      borderColor: "#495057",
                    }}
                  >
                    Current Password
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
                    New Password
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
                    Confirm New Password
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
                    "Update Password"
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
                Change Avatar
              </h4>
              <Form onSubmit={handleAvatarUpdate}>
                <div className="text-center mb-3">
                  {currentAvatarUrl && (
                    <img
                      src={currentAvatarUrl}
                      alt="Current Avatar"
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
                    Current Avatar (ID: {currentAvatarId})
                  </p>
                </div>

                <Form.Group className="mb-3">
                  <Form.Label
                    style={{
                      color: "#f8f9fa",
                      borderColor: "#495057",
                    }}
                  >
                    Select New Avatar (Pokémon)
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
                      Choose a Pokémon
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
                    label="Shiny Version ✨"
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
                    "Update Avatar"
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

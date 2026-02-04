import { useState } from "react";
import {
  Container,
  Form,
  Button,
  Card,
  Row,
  Col,
  Alert,
} from "react-bootstrap";
import { useNavigate, Link } from "react-router-dom";
import sfondo2 from "../assets/sfondoLogin2.jpg";

// Definisco l'endpoint API per la richiesta di login
const LOGIN_API_ENDPOINT = "https://mypokedex-1-fimv.onrender.com/auths/login";

const MyLogin = () => {
  // Inizializzo l'hook per la navigazione
  const navigate = useNavigate();

  // Stato per i dati del form (username e password)
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });

  // Stato per gestire gli errori di validazione del form
  const [errors, setErrors] = useState({});
  // Stato per mostrare lo spinner durante la chiamata API
  const [isLoading, setIsLoading] = useState(false);
  // Stato per mostrare errori generici dal server
  const [serverError, setServerError] = useState(null);
  // Stato per feedback di successo (anche se raramente usato prima del reindirizzamento)
  const [loginSuccess, setLoginSuccess] = useState(false);

  // Gestore del cambiamento per gli input del form
  const handleChange = (e) => {
    const { id, value } = e.target;
    // Aggiorno il formData mantenendo gli altri campi (spread operator)
    setFormData({
      ...formData,
      [id]: value,
    });

    // Se c'era un errore per questo campo, lo rimuovo quando l'utente inizia a scrivere
    if (errors[id]) {
      setErrors((prevErrors) => {
        const newErrors = { ...prevErrors };
        delete newErrors[id]; // Rimuovo l'errore specifico
        return newErrors;
      });
    }
  };

  // Funzione di validazione lato client
  const validate = () => {
    let newErrors = {};
    const { username, password } = formData;

    // Controllo validità username
    if (!username || username.length < 3) {
      newErrors.username = "Enter a valid username (at least 3 characters).";
    }

    // Controllo obbligatorietà password
    if (!password) {
      newErrors.password = "The password is required.";
    }

    // Aggiorno lo stato degli errori e restituisco true se non ci sono errori
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Gestore per l'invio del form (submit)
  const handleSubmit = (e) => {
    e.preventDefault(); // Previene il ricaricamento della pagina
    setServerError(null); // Resetto eventuali errori precedenti del server
    setLoginSuccess(false); // Resetto lo stato di successo

    // Se la validazione fallisce, mi fermo qui
    if (!validate()) {
      return;
    }

    setIsLoading(true); // Attivo lo stato di caricamento (mostra lo spinner)

    // Eseguo la chiamata di login all'API
    fetch(LOGIN_API_ENDPOINT, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData), // Invio i dati del form in formato JSON
    })
      .then((response) => {
        // Controllo se la risposta è OK (status 200-299)
        if (response.ok) {
          return response.json(); // Se OK, parso la risposta
        }

        // Se la risposta non è OK, gestisco l'errore
        return response.json().then((errorData) => {
          // Creo un oggetto Error personalizzato per la gestione successiva nel .catch
          const error = new Error(
            errorData.message || `Errore HTTP: ${response.status}`,
          );
          error.status = response.status;
          throw error; // Lancio l'errore
        });
      })
      .then((data) => {
        console.log("Login successful:", data); // Log per debug

        // Se ricevo il token (essenziale per l'autenticazione)
        if (data.token) {
          // Salvo il token nel localStorage per le future richieste autenticate
          localStorage.setItem("token", data.token);
          // Reindirizzo l'utente alla Pokedex privata
          navigate("/pokedex");
        } else {
          // Se il login ha successo ma manca il token (strano, ma gestisco)
          setServerError("Login successful, but no token received.");
        }
      })
      .catch((error) => {
        console.error("Fetch or server error:", error); // Log per debug

        // Gestione specifica degli errori
        if (error.status === 401) {
          // Errore 401: Non autorizzato (credenziali sbagliate)
          setServerError("Incorrect username or password.");
        } else if (error.status) {
          // Altri errori server (e.g., 500)
          setServerError(
            `Errore del server (${error.status}). Try again later.`,
          );
        } else {
          // Errore di rete (es. server spento o connessione assente)
          setServerError(
            "Unable to connect to the server. Check your connection.",
          );
        }
      })
      .finally(() => {
        // Blocco eseguito in ogni caso: disattivo il caricamento
        setIsLoading(false);
      });
  };

  // Inizio del rendering del componente
  return (
    <>
      {/* Wrapper esterno che contiene lo sfondo e centra il form */}
      <div
        className="registration-page-wrapper d-flex justify-content-center align-items-center pb-5"
        style={{
          backgroundImage: `url(${sfondo2})`, // Imposto lo sfondo con l'immagine importata
          backgroundSize: "cover",
          backgroundPosition: "center",
          minHeight: "100vh",
          paddingTop: "60px",
        }}
      >
        <Container>
          <Row className="justify-content-center">
            <Col md={8} lg={6} xl={5}>
              {/* Card trasparente per il contenitore del form di login */}
              <Card
                className="shadow-lg p-4"
                style={{
                  backgroundColor: "transparent", // Rendo lo sfondo della card trasparente
                  border: "none",
                }}
              >
                <Card.Body>
                  {/* Titolo della pagina di login */}
                  <h2 className="text-center mb-4 text-white">
                    Welcome back Trainer!
                  </h2>

                  {/* Alert per errori dal server (es. credenziali errate) */}
                  {serverError && (
                    <Alert variant="danger" className="text-center">
                      {serverError}
                    </Alert>
                  )}

                  {/* Alert per successo (anche se come detto, il reindirizzamento è più immediato) */}
                  {loginSuccess && (
                    <Alert variant="success" className="text-center">
                      Login successful!
                    </Alert>
                  )}

                  {/* Form di login gestito da handleSubmit */}
                  <Form onSubmit={handleSubmit}>
                    {/* Campo Nome Utente */}
                    <Form.Group
                      className="mb-3 text-white bold"
                      controlId="username" // ID del campo per l'associazione allo stato
                    >
                      <Form.Label>Username</Form.Label>
                      <Form.Control
                        type="text"
                        placeholder="Enter your username"
                        onChange={handleChange}
                        value={formData.username}
                        isInvalid={!!errors.username} // Attivo lo stile di errore se presente
                        style={{
                          // Stile personalizzato per l'input trasparente
                          backgroundColor: "rgba(255, 255, 255, 0.6)",
                          color: "black",
                          border: "1px solid rgba(255, 255, 255, 0.3)",
                        }}
                      />
                      {/* Messaggio di feedback di errore per l'username */}
                      <Form.Control.Feedback type="invalid">
                        {errors.username}
                      </Form.Control.Feedback>
                    </Form.Group>

                    {/* Campo Password */}
                    <Form.Group
                      className="mb-4 text-white bold"
                      controlId="password" // ID del campo per l'associazione allo stato
                    >
                      <Form.Label>Password</Form.Label>
                      <Form.Control
                        type="password"
                        placeholder="Password"
                        onChange={handleChange}
                        value={formData.password}
                        isInvalid={!!errors.password} // Attivo lo stile di errore se presente
                        style={{
                          // Stile personalizzato per l'input trasparente
                          backgroundColor: "rgba(255, 255, 255, 0.6)",
                          color: "black",
                          border: "1px solid rgba(255, 255, 255, 0.3)",
                        }}
                      />
                      {/* Messaggio di feedback di errore per la password */}
                      <Form.Control.Feedback type="invalid">
                        {errors.password}
                      </Form.Control.Feedback>
                    </Form.Group>

                    {/* Bottone di Login (con gestione stato di caricamento) */}
                    <Button
                      variant="warning" // Bottone giallo/Pokémon
                      type="submit"
                      className="w-100 p-2"
                      disabled={isLoading} // Disabilita se la richiesta è in corso
                    >
                      {isLoading ? (
                        <>
                          {/* Se in caricamento, mostra lo spinner e il testo "Accesso in corso..." */}
                          <span
                            className="spinner-border spinner-border-sm me-2"
                            role="status"
                            aria-hidden="true"
                          ></span>
                          Logging in...
                        </>
                      ) : (
                        "Log In" // Altrimenti mostra il testo normale
                      )}
                    </Button>

                    {/* Link per la Registrazione */}
                    <p className="mt-3 text-center text-white small">
                      Don't have an account?{" "}
                      <Link
                        to="/register"
                        className="text-primary text-decoration-none"
                      >
                        Sign up here
                      </Link>
                    </p>
                  </Form>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Container>
      </div>
    </>
  );
};

export default MyLogin;

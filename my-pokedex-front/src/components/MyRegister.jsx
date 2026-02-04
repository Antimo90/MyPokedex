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
import sfondo from "../assets/SfondoRegistrazione.jpg";
import { Link } from "react-router-dom";

// Definisco l'endpoint API per la richiesta di registrazione
const REGISTER_API_ENDPOINT =
  "https://mypokedex-1-fimv.onrender.com/auths/register";

const MyRegister = () => {
  // Stato per i dati del form
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "", // Campo aggiuntivo per la verifica lato client
  });

  // Stato per gestire gli errori di validazione del form
  const [errors, setErrors] = useState({});
  // Stato per feedback di successo della registrazione
  const [registrationSuccess, setRegistrationSuccess] = useState(false);

  // Stato per mostrare lo spinner durante la chiamata API
  const [isLoading, setIsLoading] = useState(false);
  // Stato per mostrare errori generici o specifici dal server
  const [serverError, setServerError] = useState(null);

  // Gestore del cambiamento per gli input del form
  const handleChange = (e) => {
    const { id, value } = e.target;
    // Aggiorno il formData mantenendo gli altri campi
    setFormData({
      ...formData,
      [id]: value,
    });

    // Rimuovo l'errore specifico se l'utente ricomincia a scrivere nel campo
    if (errors[id]) {
      setErrors((prevErrors) => {
        const newErrors = { ...prevErrors };
        delete newErrors[id];
        return newErrors;
      });
    }
  };

  // Funzione di validazione lato client
  const validate = () => {
    let newErrors = {};
    const { username, email, password, confirmPassword } = formData;

    // Validazione Username
    if (!username.trim()) {
      newErrors.username = "The username is required.";
    }

    // Validazione Email
    if (!email) {
      newErrors.email = "The email is required.";
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      // Regex base per la validazione del formato email
      newErrors.email = "The email address is invalid.";
    }

    // Validazione Password (lunghezza minima)
    if (password.length < 8) {
      newErrors.password = "The password must contain at least 8 characters.";
    }

    // Validazione Conferma Password (deve corrispondere)
    if (password !== confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match.";
    }

    setErrors(newErrors);
    // Ritorna true se l'oggetto errors è vuoto
    return Object.keys(newErrors).length === 0;
  };

  // Gestore per l'invio del form (submit)
  const handleSubmit = (e) => {
    e.preventDefault();
    setRegistrationSuccess(false); // Resetto stato successo
    setServerError(null); // Resetto errori server

    if (!validate()) {
      console.log("Client-side validation error.");
      return;
    }

    setIsLoading(true); // Attivo lo stato di caricamento

    // Destructuring per creare 'dataToSend' e omettere 'confirmPassword'
    const { confirmPassword: _, ...dataToSend } = formData;

    // Chiamata Fetch all'API di registrazione
    fetch(REGISTER_API_ENDPOINT, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(dataToSend), // Invio solo username, email e password
    })
      .then((response) => {
        if (response.ok) {
          return response.json();
        }

        // Gestione degli errori HTTP, creo un oggetto Error con status e messaggio
        return response.json().then((errorData) => {
          const error = new Error(
            errorData.message || `Errore HTTP: ${response.status}`,
          );
          error.status = response.status;
          error.data = errorData;
          throw error;
        });
      })
      .then((data) => {
        console.log("Registration successful:", data);
        setRegistrationSuccess(true); // Imposto il messaggio di successo

        // Resetto i campi del form dopo una registrazione riuscita
        setFormData({
          username: "",
          email: "",
          password: "",
          confirmPassword: "",
        });
      })
      .catch((error) => {
        console.error("Fetch or server error:", error);

        // Gestione specifica per errori comuni di registrazione (es. utente già esistente)
        if (error.status === 409 || error.status === 400) {
          setServerError(error.message); // Uso il messaggio d'errore fornito dal server
        } else if (error.status) {
          // Altri errori server
          setServerError(`Server Error (${error.status}). Try again later.`);
        } else {
          // Errore di connessione / rete
          setServerError(
            "Unable to connect to the server. Check your connection.",
          );
        }
      })
      .finally(() => {
        setIsLoading(false); // Disattivo il caricamento
      });
  };

  // Inizio del rendering del componente
  return (
    <>
      {/* Wrapper esterno con sfondo e centratura */}
      <div
        className="registration-page-wrapper d-flex justify-content-center align-items-center pb-5"
        style={{
          backgroundImage: `url(${sfondo})`, // Immagine di sfondo
          backgroundSize: "cover",
          backgroundPosition: "center",
          minHeight: "100vh",
          paddingTop: "60px",
        }}
      >
        <Container>
          <Row className="justify-content-center">
            <Col md={8} lg={6} xl={5}>
              {/* Card per contenere il form */}
              <Card className="shadow-lg p-4 custom-card-opacity">
                <Card.Body>
                  <h2 className="text-center mb-4 text-dark">
                    Become a Trainer!
                  </h2>
                  {/* Visualizzazione Errore Server */}
                  {serverError && (
                    <Alert variant="danger" className="text-center">
                      {serverError}
                    </Alert>
                  )}
                  {/* Visualizzazione Successo Registrazione */}
                  {registrationSuccess && (
                    <Alert variant="success" className="text-center">
                      Registration successful! Go to{" "}
                      <Link to="/login">Login</Link>. {/* Link per il login */}
                    </Alert>
                  )}
                  {/* Form di Registrazione */}
                  <Form onSubmit={handleSubmit}>
                    {/* Campo Username */}
                    <Form.Group className="mb-3" controlId="username">
                      <Form.Label>Username</Form.Label>
                      <Form.Control
                        type="text"
                        placeholder="Choose your Trainer name"
                        onChange={handleChange}
                        value={formData.username}
                        isInvalid={!!errors.username}
                      />
                      <Form.Control.Feedback type="invalid">
                        {errors.username}
                      </Form.Control.Feedback>
                    </Form.Group>

                    {/* Campo Email */}
                    <Form.Group className="mb-3" controlId="email">
                      <Form.Label>Email Address</Form.Label>
                      <Form.Control
                        type="email"
                        placeholder="Enter the email"
                        onChange={handleChange}
                        value={formData.email}
                        isInvalid={!!errors.email}
                      />
                      <Form.Control.Feedback type="invalid">
                        {errors.email}
                      </Form.Control.Feedback>

                      <Form.Text className="text-muted">
                        We will not share your email with anyone.
                      </Form.Text>
                    </Form.Group>

                    {/* Campo Password */}
                    <Form.Group className="mb-3" controlId="password">
                      <Form.Label>Password</Form.Label>
                      <Form.Control
                        type="password"
                        placeholder="Password (at least 8 characters)"
                        onChange={handleChange}
                        value={formData.password}
                        isInvalid={!!errors.password}
                      />
                      <Form.Control.Feedback type="invalid">
                        {errors.password}
                      </Form.Control.Feedback>
                    </Form.Group>

                    {/* Campo Conferma Password */}
                    <Form.Group className="mb-4" controlId="confirmPassword">
                      <Form.Label>Confirm Password</Form.Label>
                      <Form.Control
                        type="password"
                        placeholder="Confirm Password"
                        onChange={handleChange}
                        value={formData.confirmPassword}
                        isInvalid={!!errors.confirmPassword}
                      />
                      <Form.Control.Feedback type="invalid">
                        {errors.confirmPassword}
                      </Form.Control.Feedback>
                    </Form.Group>

                    {/* Bottone di Registrazione con stato di caricamento */}
                    <Button
                      variant="success"
                      type="submit"
                      className="w-100 p-2"
                      disabled={isLoading}
                    >
                      {isLoading ? (
                        <>
                          {/* Spinner di caricamento */}
                          <span
                            className="spinner-border spinner-border-sm me-2"
                            role="status"
                            aria-hidden="true"
                          ></span>
                          Signing up...
                        </>
                      ) : (
                        "Sign Up" // Testo normale
                      )}
                    </Button>

                    {/* Link per il Login */}
                    <p className="mt-3 text-center small">
                      Already have an account?{" "}
                      <a
                        href="/login"
                        className="text-primary text-decoration-none"
                      >
                        Log in here
                      </a>
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

// Esporto il componente Registrazione
export default MyRegister;

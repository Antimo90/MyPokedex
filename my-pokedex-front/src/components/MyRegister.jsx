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

const REGISTER_API_ENDPOINT = "http://localhost:3001/auths/register";

const MyRegister = () => {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [errors, setErrors] = useState({});
  const [registrationSuccess, setRegistrationSuccess] = useState(false);

  const [isLoading, setIsLoading] = useState(false);
  const [serverError, setServerError] = useState(null);

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData({
      ...formData,
      [id]: value,
    });

    if (errors[id]) {
      setErrors((prevErrors) => {
        const newErrors = { ...prevErrors };
        delete newErrors[id];
        return newErrors;
      });
    }
  };

  const validate = () => {
    let newErrors = {};
    const { username, email, password, confirmPassword } = formData;

    if (!username.trim()) {
      newErrors.username = "L'username è obbligatorio.";
    }

    if (!email) {
      newErrors.email = "L'email è obbligatoria.";
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = "L'indirizzo email non è valido.";
    }

    if (password.length < 8) {
      newErrors.password = "La password deve contenere almeno 8 caratteri.";
    }

    if (password !== confirmPassword) {
      newErrors.confirmPassword = "Le password non corrispondono.";
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setRegistrationSuccess(false);
    setServerError(null);

    if (!validate()) {
      console.log("Errore di validazione lato client.");
      return;
    }

    setIsLoading(true);

    const { confirmPassword: _, ...dataToSend } = formData;

    fetch(REGISTER_API_ENDPOINT, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(dataToSend),
    })
      .then((response) => {
        if (response.ok) {
          return response.json();
        }

        return response.json().then((errorData) => {
          const error = new Error(
            errorData.message || `Errore HTTP: ${response.status}`
          );
          error.status = response.status;
          error.data = errorData;
          throw error;
        });
      })
      .then((data) => {
        console.log("Registrazione riuscita:", data);
        setRegistrationSuccess(true);

        setFormData({
          username: "",
          email: "",
          password: "",
          confirmPassword: "",
        });
      })
      .catch((error) => {
        console.error("Errore di fetch o server:", error);

        if (error.status === 409 || error.status === 400) {
          setServerError(error.message);
        } else if (error.status) {
          setServerError(
            `Errore del server (${error.status}). Riprova più tardi.`
          );
        } else {
          setServerError(
            "Impossibile connettersi al server. Controlla la tua connessione."
          );
        }
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  return (
    <>
      <div
        className="registration-page-wrapper d-flex justify-content-center align-items-center pb-5"
        style={{
          backgroundImage: `url(${sfondo})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          minHeight: "100vh",
          paddingTop: "60px",
        }}
      >
        <Container>
          <Row className="justify-content-center">
            <Col md={8} lg={6} xl={5}>
              <Card className="shadow-lg p-4 custom-card-opacity">
                <Card.Body>
                  <h2 className="text-center mb-4 text-dark">
                    Diventa un Allenatore!
                  </h2>
                  {serverError && (
                    <Alert variant="danger" className="text-center">
                      {serverError}
                    </Alert>
                  )}
                  {registrationSuccess && (
                    <Alert variant="success" className="text-center">
                      Registrazione avvenuta con successo! Vai al{" "}
                      <a href="/login">Login</a>.
                    </Alert>
                  )}
                  <Form onSubmit={handleSubmit}>
                    <Form.Group className="mb-3" controlId="username">
                      <Form.Label>Username</Form.Label>
                      <Form.Control
                        type="text"
                        placeholder="Scegli il tuo nome da Allenatore"
                        onChange={handleChange}
                        value={formData.username}
                        isInvalid={!!errors.username}
                      />
                      <Form.Control.Feedback type="invalid">
                        {errors.username}
                      </Form.Control.Feedback>
                    </Form.Group>

                    <Form.Group className="mb-3" controlId="email">
                      <Form.Label>Indirizzo Email</Form.Label>
                      <Form.Control
                        type="email"
                        placeholder="Inserisci l'email"
                        onChange={handleChange}
                        value={formData.email}
                        isInvalid={!!errors.email}
                      />
                      <Form.Control.Feedback type="invalid">
                        {errors.email}
                      </Form.Control.Feedback>

                      <Form.Text className="text-muted">
                        Non condivideremo la tua email con nessuno.
                      </Form.Text>
                    </Form.Group>

                    <Form.Group className="mb-3" controlId="password">
                      <Form.Label>Password</Form.Label>
                      <Form.Control
                        type="password"
                        placeholder="Password (almeno 8 caratteri)"
                        onChange={handleChange}
                        value={formData.password}
                        isInvalid={!!errors.password}
                      />
                      <Form.Control.Feedback type="invalid">
                        {errors.password}
                      </Form.Control.Feedback>
                    </Form.Group>

                    <Form.Group className="mb-4" controlId="confirmPassword">
                      <Form.Label>Conferma Password</Form.Label>
                      <Form.Control
                        type="password"
                        placeholder="Conferma la Password"
                        onChange={handleChange}
                        value={formData.confirmPassword}
                        isInvalid={!!errors.confirmPassword}
                      />
                      <Form.Control.Feedback type="invalid">
                        {errors.confirmPassword}
                      </Form.Control.Feedback>
                    </Form.Group>

                    <Button
                      variant="success"
                      type="submit"
                      className="w-100 p-2"
                      disabled={isLoading}
                    >
                      {isLoading ? (
                        <>
                          <span
                            className="spinner-border spinner-border-sm me-2"
                            role="status"
                            aria-hidden="true"
                          ></span>
                          Registrazione in corso...
                        </>
                      ) : (
                        "Registrati"
                      )}
                    </Button>

                    <p className="mt-3 text-center small">
                      Hai già un account?{" "}
                      <a
                        href="/login"
                        className="text-primary text-decoration-none"
                      >
                        Accedi qui
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

export default MyRegister;

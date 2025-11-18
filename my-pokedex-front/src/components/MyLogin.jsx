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
import { useNavigate } from "react-router-dom";
import sfondo2 from "../assets/sfondoLogin2.jpg";

const LOGIN_API_ENDPOINT = "http://localhost:3001/auths/login";

const MyLogin = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });

  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [serverError, setServerError] = useState(null);
  const [loginSuccess, setLoginSuccess] = useState(false); // Stato per feedback

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
    const { username, password } = formData;

    if (!username || username.length < 3) {
      newErrors.username = "Inserisci un username valido (almeno 3 caratteri).";
    }

    if (!password) {
      newErrors.password = "La password è obbligatoria.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setServerError(null);
    setLoginSuccess(false);

    if (!validate()) {
      return;
    }

    setIsLoading(true);

    fetch(LOGIN_API_ENDPOINT, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
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
          throw error;
        });
      })
      .then((data) => {
        console.log("Login riuscito:", data);

        if (data.token) {
          localStorage.setItem("authToken", data.token);
          navigate("/pokedex");
        } else {
          setServerError("Login riuscito, ma nessun token ricevuto.");
        }
      })
      .catch((error) => {
        console.error("Errore di fetch o server:", error);

        if (error.status === 401) {
          setServerError("Username o password non corretti.");
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
          backgroundImage: `url(${sfondo2})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          minHeight: "100vh",
          paddingTop: "60px",
        }}
      >
        <Container>
          <Row className="justify-content-center">
            <Col md={8} lg={6} xl={5}>
              <Card
                className="shadow-lg p-4"
                style={{
                  backgroundColor: "transparent",
                  border: "none",
                }}
              >
                <Card.Body>
                  <h2 className="text-center mb-4 text-white">
                    Bentornato Allenatore!
                  </h2>

                  {serverError && (
                    <Alert variant="danger" className="text-center">
                      {serverError}
                    </Alert>
                  )}

                  {loginSuccess && (
                    <Alert variant="success" className="text-center">
                      Login effettuato con successo!
                    </Alert>
                  )}

                  <Form onSubmit={handleSubmit}>
                    <Form.Group
                      className="mb-3 text-white bold"
                      controlId="username"
                    >
                      <Form.Label>Nome Utente</Form.Label>
                      <Form.Control
                        type="text"
                        placeholder="Inserisci il tuo nome utente"
                        onChange={handleChange}
                        value={formData.username}
                        isInvalid={!!errors.username}
                        style={{
                          backgroundColor: "rgba(255, 255, 255, 0.6)",
                          color: "black",
                          border: "1px solid rgba(255, 255, 255, 0.3)",
                        }}
                      />
                      <Form.Control.Feedback type="invalid">
                        {errors.username}
                      </Form.Control.Feedback>
                    </Form.Group>

                    <Form.Group
                      className="mb-4 text-white bold"
                      controlId="password"
                    >
                      <Form.Label>Password</Form.Label>
                      <Form.Control
                        type="password"
                        placeholder="Password"
                        onChange={handleChange}
                        value={formData.password}
                        isInvalid={!!errors.password}
                        style={{
                          backgroundColor: "rgba(255, 255, 255, 0.6)",
                          color: "black",
                          border: "1px solid rgba(255, 255, 255, 0.3)",
                        }}
                      />
                      <Form.Control.Feedback type="invalid">
                        {errors.password}
                      </Form.Control.Feedback>
                    </Form.Group>

                    <Button
                      variant="primary"
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
                          Accesso in corso...
                        </>
                      ) : (
                        "Accedi"
                      )}
                    </Button>

                    <p className="mt-3 text-center text-white small">
                      Non hai un account?{" "}
                      <a
                        href="/register"
                        className="text-primary text-decoration-none"
                      >
                        Registrati qui
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

export default MyLogin;

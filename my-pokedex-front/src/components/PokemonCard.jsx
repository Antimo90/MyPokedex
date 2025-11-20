import { Card, Badge } from "react-bootstrap";
import { Link } from "react-router-dom";

const PokemonCard = ({ pokemon }) => {
  const formatId = (id) => {
    return String(id).padStart(3, "0");
  };

  if (!pokemon) {
    return <Card className="p-3 text-center">Pokémon non trovato.</Card>;
  }

  const types = [];
  if (pokemon.type1) {
    types.push(pokemon.type1);
  }
  if (pokemon.type2) {
    types.push(pokemon.type2);
  }

  const detailLink = `/pokemon/${pokemon.idPokemon}`;

  return (
    <Card className="text-center h-100 shadow-sm pokemon-card-custom-final">
      <Link
        to={detailLink}
        style={{ textDecoration: "none", color: "inherit" }}
      >
        <div className="pokemon-card-image-container-final">
          <div className="pokemon-card-image-circle"></div>
          <Card.Img
            variant="top"
            src={pokemon.spriteUrl}
            alt={pokemon.name}
            className="card-img-top"
          />
        </div>

        <Card.Body className="d-flex flex-column justify-content-center align-items-center p-2 card-body-final">
          <div className="pokemon-card-id-number-final">
            {formatId(pokemon.idPokemon)}
          </div>

          <Card.Title className="text-capitalize mb-2 fs-5">
            {pokemon.name}
          </Card.Title>

          <div className="d-flex justify-content-center flex-wrap gap-1">
            {types.length > 0 &&
              types.map((type, index) => {
                const finalColor = type.colorHex;

                return (
                  <span
                    key={index}
                    className="badge d-inline-block text-capitalize px-2 py-1 rounded-pill"
                    style={{
                      backgroundColor: `${finalColor}`,
                      color: "#FFF",
                    }}
                  >
                    {type.name}
                  </span>
                );
              })}
          </div>
        </Card.Body>
      </Link>
    </Card>
  );
};

export default PokemonCard;

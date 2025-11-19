import { Card, Badge } from "react-bootstrap";
import { Link } from "react-router-dom";

const PokemonCard = ({ pokemon }) => {
  const formatId = (id) => {
    return String(id).padStart(3, "0");
  };

  const getBadgeColor = (typeName) => {
    switch (typeName.toLowerCase()) {
      case "fire":
        return "#EE8130";
      case "water":
        return "#6390F0";
      case "grass":
        return "#7AC74C";
      case "electric":
        return "#F7D02C";
      case "normal":
        return "#A8A77A";
      case "fighting":
        return "#C22E28";
      case "flying":
        return "#A98FF3";
      case "poison":
        return "#A33EA1";
      case "ground":
        return "#E2BF65";
      case "rock":
        return "#B6A136";
      case "bug":
        return "#A6B91A";
      case "ghost":
        return "#735797";
      case "steel":
        return "#B7B7CE";
      case "psychic":
        return "#F95587";
      case "ice":
        return "#96D9D6";
      case "dragon":
        return "#6F35FC";
      case "dark":
        return "#705746";
      case "fairy":
        return "#DDA0DD";
      default:
        return "#888888";
    }
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
    <Card className="text-center shadow-sm h-100 position-relative pokemon-card-custom">
      <Link
        to={detailLink}
        style={{ textDecoration: "none", color: "inherit" }}
      >
        <Badge
          bg="dark"
          className="position-absolute top-0 end-0 m-2 fw-bold"
          style={{ opacity: 0.8 }}
        >
          #{formatId(pokemon.idPokemon)}
        </Badge>

        <Card.Img
          variant="top"
          src={pokemon.spriteUrl}
          alt={pokemon.name}
          className="p-3"
          style={{ width: "100%", height: "120px", objectFit: "contain" }}
        />

        <Card.Body className="d-flex flex-column justify-content-between p-2">
          <Card.Title className="text-capitalize mb-2 fs-5 text-dark fw-bold">
            {pokemon.name}
          </Card.Title>

          <div className="d-flex justify-content-center flex-wrap gap-1">
            {types.length > 0 &&
              types.map((type) => (
                <Badge
                  key={type.idType}
                  className="text-white text-capitalize px-2 py-1"
                  style={{
                    backgroundColor: type.colorHex || getBadgeColor(type.name),
                  }}
                >
                  {type.name}
                </Badge>
              ))}
          </div>
        </Card.Body>
      </Link>
    </Card>
  );
};

export default PokemonCard;

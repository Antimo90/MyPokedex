import { Card } from "react-bootstrap";
import { Link } from "react-router-dom";
import PokeballIcon from "../assets/pokeball-icon.png";

const PokemonCardUser = ({ pokemon, isSelected, onCaptureToggle }) => {
  const formatId = (id) => {
    return String(id).padStart(3, "0");
  };

  if (!pokemon) {
    return <Card className="p-3 text-center">Pokémon non trovato.</Card>;
  }

  const isLinkActive = isSelected && pokemon.idPokemon > 0;

  const types = [];
  if (pokemon.type1) {
    types.push(pokemon.type1);
  }
  if (pokemon.type2) {
    types.push(pokemon.type2);
  }

  const detailLink = `/pokemon/${pokemon.idPokemon}`;

  const Wrapper = isLinkActive ? Link : "div";
  const wrapperProps = isLinkActive
    ? {
        to: detailLink,
        style: { textDecoration: "none", color: "inherit", cursor: "pointer" },
      }
    : {
        style: { textDecoration: "none", color: "inherit", cursor: "default" },
      };

  const handleToggleSelect = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (pokemon.idPokemon <= 0) {
      return;
    }
    if (onCaptureToggle) {
      const shouldCapture = !isSelected;

      try {
        await onCaptureToggle(pokemon.idPokemon, shouldCapture);
      } catch (error) {
        console.error("Errore durante la cattura/rilascio del Pokémon:", error);
      }
    }
  };

  const formatHiddenName = (name) => {
    return Array(name.length).fill("?").join("");
  };

  const displayedName = isSelected
    ? pokemon.name
    : formatHiddenName(pokemon.name);
  const displayedId = isSelected ? formatId(pokemon.idPokemon) : "???";

  return (
    <Card
      className={`text-center h-100 shadow-sm pokemon-card-custom-final ${
        isSelected ? "pokemon-selected" : ""
      }`}
    >
      <div className="pokeball-select-area" onClick={handleToggleSelect}>
        {isSelected && (
          <img
            src={PokeballIcon}
            alt="Seleziona"
            className="pokeball-icon pokeball-checked"
          />
        )}
      </div>

      <Wrapper {...wrapperProps}>
        <div className="pokemon-card-image-container-final">
          <div className="pokemon-card-image-circle"></div>

          <Card.Img
            variant="top"
            src={pokemon.spriteUrl}
            alt={pokemon.name}
            className={`card-img-top pokemon-image ${
              isSelected ? "pokemon-colored" : "pokemon-black"
            }`}
          />
        </div>

        <Card.Body className="d-flex flex-column justify-content-center align-items-center p-2 card-body-final">
          <div className="pokemon-card-id-number-final">{displayedId}</div>

          <Card.Title className="text-capitalize mb-2 fs-5">
            {displayedName}
          </Card.Title>

          <div className="d-flex justify-content-center flex-wrap gap-1">
            {types.length > 0 &&
              types.map((type, index) => {
                const badgeText = isSelected ? type.name : "?";

                const finalColor = isSelected ? type.colorHex : "#495057";

                return (
                  <span
                    key={index}
                    className="badge d-inline-block text-capitalize px-2 py-1 rounded-pill"
                    style={{
                      backgroundColor: `${finalColor}`,
                      color: "#FFF",
                    }}
                  >
                    {badgeText}
                  </span>
                );
              })}
          </div>
        </Card.Body>
      </Wrapper>
    </Card>
  );
};

export default PokemonCardUser;

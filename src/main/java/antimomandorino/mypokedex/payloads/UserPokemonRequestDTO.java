package antimomandorino.mypokedex.payloads;

import jakarta.validation.constraints.NotNull;

public record UserPokemonRequestDTO(


        @NotNull(message = "L'ID del Pokemon è obbligatorio")
        Integer pokemonId,

        Boolean isShiny
) {
}
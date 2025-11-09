package antimomandorino.mypokedex.payloads;

import java.util.Set;

public record PokemonViewDTO(
        int idPokemon,
        String name,
        String description,
        int height,
        int weight,
        String speciesCategory,
        String spriteUrl,
        String spriteShinyUrl,
        TypeDTO type1,
        TypeDTO type2,
        StatDTO stats,
        Set<AbilityDTO> abilities
) {
}
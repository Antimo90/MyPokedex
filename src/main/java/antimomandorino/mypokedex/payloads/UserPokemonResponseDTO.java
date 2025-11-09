package antimomandorino.mypokedex.payloads;

public record UserPokemonResponseDTO(
        Long collectionId, // ID del record nella tabella UserPokemon
        boolean isShiny,

        // Dettagli semplificati del Pokemon catturato
        PokemonViewDTO pokemonDetails
) {
}
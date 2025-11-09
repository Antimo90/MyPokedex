package antimomandorino.mypokedex.pokeAPIPayloads;

import java.util.List;

public record PokemonSpeciesApiDTO(
        String name,
        List<GenusEntry> genera, // Categoria della specie
        List<FlavorTextEntry> flavor_text_entries // Descrizioni del Pokédex
) {
    public record GenusEntry(
            String genus,
            ApiResource language
    ) {
    }

    public record FlavorTextEntry(
            String flavor_text,
            ApiResource language
    ) {
    }
}
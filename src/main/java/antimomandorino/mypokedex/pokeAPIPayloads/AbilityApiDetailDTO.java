package antimomandorino.mypokedex.pokeAPIPayloads;

import java.util.List;

public record AbilityApiDetailDTO(
        String name,
        List<EffectEntry> effect_entries,
        List<FlavorTextEntry> flavor_text_entries
) {
    public record EffectEntry(
            String effect,
            String short_effect,
            ApiResource language
    ) {
    }

    public record FlavorTextEntry(
            String flavor_text,
            ApiResource language
    ) {
    }
}
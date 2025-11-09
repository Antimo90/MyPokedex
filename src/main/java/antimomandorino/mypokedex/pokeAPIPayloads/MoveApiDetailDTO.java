package antimomandorino.mypokedex.pokeAPIPayloads;

import java.util.List;

public record MoveApiDetailDTO(
        String name,
        Integer power,
        Integer accuracy,
        ApiResource type,
        List<EffectEntry> effect_entries
) {
    public record EffectEntry(
            String effect,
            String short_effect,
            ApiResource language
    ) {
    }
}
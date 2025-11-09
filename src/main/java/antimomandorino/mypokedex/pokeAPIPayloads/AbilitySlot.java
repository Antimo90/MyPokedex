package antimomandorino.mypokedex.pokeAPIPayloads;

public record AbilitySlot(
        ApiResource ability,
        Boolean is_hidden,
        Integer slot
) {
}

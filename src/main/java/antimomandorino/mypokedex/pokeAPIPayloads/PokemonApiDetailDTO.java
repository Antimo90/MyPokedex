package antimomandorino.mypokedex.pokeAPIPayloads;

import java.util.List;

public record PokemonApiDetailDTO(
        Integer id,
        String name,
        Integer height,
        Integer weight,


        List<TypeSlot> types,
        List<AbilitySlot> abilities,
        List<StatSlot> stats,
        Sprites sprites,
        List<MoveEntry> moves
) {
}

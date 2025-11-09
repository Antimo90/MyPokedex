package antimomandorino.mypokedex.pokeAPIPayloads;

import java.util.List;

public record GenerationDetails(
        int id,
        String name,
        List<ApiResource> moves
) {
}

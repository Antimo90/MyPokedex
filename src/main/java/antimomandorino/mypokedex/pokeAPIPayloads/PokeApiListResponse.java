package antimomandorino.mypokedex.pokeAPIPayloads;

import java.util.List;

public record PokeApiListResponse(
        Integer count,
        String next,
        String previous,
        List<ApiResource> results
) {
}
package antimomandorino.mypokedex.payloads;

import jakarta.validation.constraints.Min;

public record StatDTO(
        @Min(value = 0) int hp,
        @Min(value = 0) int attack,
        @Min(value = 0) int defense,
        @Min(value = 0) int specialAttack,
        @Min(value = 0) int specialDefense,
        @Min(value = 0) int speed
) {
}

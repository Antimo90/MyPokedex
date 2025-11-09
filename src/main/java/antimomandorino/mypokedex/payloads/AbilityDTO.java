package antimomandorino.mypokedex.payloads;

import jakarta.validation.constraints.NotBlank;

public record AbilityDTO(
        Long idAbility,
        @NotBlank(message = "Il nome è obbligatorio")
        String name,
        String description
) {
}

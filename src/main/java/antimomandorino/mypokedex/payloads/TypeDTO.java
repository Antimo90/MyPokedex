package antimomandorino.mypokedex.payloads;

import jakarta.validation.constraints.NotBlank;

public record TypeDTO(
        Long idType,
        @NotBlank(message = "Il nome è obbligatorio")
        String name,
        @NotBlank(message = "L'hex code è obbligatorio")
        String colorHex
) {
}
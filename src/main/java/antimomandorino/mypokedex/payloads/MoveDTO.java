package antimomandorino.mypokedex.payloads;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public record MoveDTO(
        @NotNull(message = "L'ID della mossa è obbligatorio")
        Integer idMove, // Usiamo Integer per coerenza con l'Entity

        @NotBlank(message = "Il nome della mossa è obbligatorio")
        String name,

        String description,

        @NotNull(message = "La potenza è obbligatoria")
        int power,

        @NotNull(message = "L'accuratezza è obbligatoria")
        int accuracy,

        @NotBlank(message = "Il nome del tipo è obbligatorio")
        String typeName
) {
}

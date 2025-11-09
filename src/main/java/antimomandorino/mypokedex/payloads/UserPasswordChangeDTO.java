package antimomandorino.mypokedex.payloads;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record UserPasswordChangeDTO(

        @NotBlank(message = "La password attuale è obbligatoria")
        String oldPassword,

        @NotBlank(message = "La nuova password è obbligatoria")
        @Size(min = 8, message = "La nuova password deve avere almeno 8 caratteri")
        String newPassword
) {
}

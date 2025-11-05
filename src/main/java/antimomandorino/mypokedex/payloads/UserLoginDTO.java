package antimomandorino.mypokedex.payloads;

import jakarta.validation.constraints.NotEmpty;

public record UserLoginDTO(

        @NotEmpty(message = "Il campo username è obbligatorio")
        String username,

        @NotEmpty(message = "Il campo password è obbligatorio")
        String password
) {
}

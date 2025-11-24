package antimomandorino.mypokedex.payloads;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record UserProfileUpdateDTO(
        @NotBlank(message = "Il campo username è obbligatorio")
        @Size(min = 3, max = 30, message = "Lo username deve essere tra 3 e 30 caratteri")
        String username,

        @NotBlank(message = "Il campo email è obbligatorio")
        @Email(message = "L'email inserita non è valida")
        String email) {

}
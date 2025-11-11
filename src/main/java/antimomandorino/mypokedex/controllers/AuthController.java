package antimomandorino.mypokedex.controllers;

import antimomandorino.mypokedex.entities.User;
import antimomandorino.mypokedex.exceptions.ValidationException;
import antimomandorino.mypokedex.payloads.LoginResponseDTO;
import antimomandorino.mypokedex.payloads.UserLoginDTO;
import antimomandorino.mypokedex.payloads.UserRegistrationDTO;
import antimomandorino.mypokedex.services.AuthService;
import antimomandorino.mypokedex.services.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.validation.BindingResult;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/auth")
public class AuthController {

    @Autowired
    private AuthService authService;

    @Autowired
    private UserService userService;

    // 1. POST per login
    @PostMapping("/login")
    public LoginResponseDTO login(@RequestBody UserLoginDTO body) {
        return new LoginResponseDTO(this.authService.checkAndCreateToken(body));
    }

    // 2. POST per registration
    @PostMapping("/register")
    @ResponseStatus(HttpStatus.CREATED)
    public User register(@RequestBody @Validated UserRegistrationDTO bodyUtente, BindingResult validationResult) {
        if (validationResult.hasErrors()) {
            throw new ValidationException(validationResult.getFieldErrors().stream().map(fieldError -> fieldError.getDefaultMessage()).toList());
        }

        return this.userService.saveUser(bodyUtente);
    }
}

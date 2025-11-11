package antimomandorino.mypokedex.services;

import antimomandorino.mypokedex.entities.User;
import antimomandorino.mypokedex.exceptions.UnauthorizedException;
import antimomandorino.mypokedex.payloads.UserLoginDTO;
import antimomandorino.mypokedex.security.JWTTools;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class AuthService {

    @Autowired
    private UserService userService; // Per trovare l'utente

    @Autowired
    private PasswordEncoder bcrypt;

    @Autowired
    private JWTTools jwtTools;

    public String checkAndCreateToken(UserLoginDTO bodyLogin) {
        User userFound = userService.findUserByUsername(bodyLogin.username());

        if (bcrypt.matches(bodyLogin.password(), userFound.getPassword())) {
            return jwtTools.createToken(userFound);
        } else {
            throw new UnauthorizedException("Credenziali non valide");
        }
    }
}

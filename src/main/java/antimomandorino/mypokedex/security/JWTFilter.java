package antimomandorino.mypokedex.security;

import antimomandorino.mypokedex.entities.User;
import antimomandorino.mypokedex.exceptions.UnauthorizedException;
import antimomandorino.mypokedex.services.UserService;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.util.AntPathMatcher;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;

@Component
public class JWTFilter extends OncePerRequestFilter {

    @Autowired
    private JWTTools jwtTools;

    @Autowired
    private UserService userService;

    //Logica principale del filtro: viene eseguita per ogni richiesta.
    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain) throws ServletException, IOException {

        //Verifica header
        String authHeader = request.getHeader("Authorization");
        // Se l'header è mancante o non inizia con "Bearer ", lancio un errore di non autorizzazione.
        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            throw new UnauthorizedException("Insert the token in the authorization header in the correct format.");
        }

        //Estrazione e validazione del token
        // Rimuovo il prefisso "Bearer " per isolare il token.
        String accessToken = authHeader.replace("Bearer ", "");
        // Verifico che il token sia valido
        jwtTools.verifyToken(accessToken);

        //Ricerca dell'user nel DB
        // 1. Estraggo l'ID utente dal token.
        Long idUser = jwtTools.exctractIdFromToken(accessToken);
        // 2. Uso il servizio utente per recuperare i dati completi dell'utente dal database.
        User userFound = this.userService.findUserById(idUser);
        
        //Autorizzazione
        Authentication authentication = new UsernamePasswordAuthenticationToken(userFound, null, userFound.getAuthorities());

        //Inserimento nel contesto di sicurezza
        SecurityContextHolder.getContext().setAuthentication(authentication);

        //Passa al prossimo filtro della catena
        filterChain.doFilter(request, response);
    }

    // Disattivazione dei filtri per gli endpoint pubblici
    @Override
    protected boolean shouldNotFilter(HttpServletRequest request) throws ServletException {

        String path = request.getServletPath();
        AntPathMatcher pathMatcher = new AntPathMatcher();

        // Includi tutti i percorsi che devono essere pubblici
        return pathMatcher.match("/auths/**", path) ||
                (pathMatcher.match("/pokemon", path) && request.getMethod().equals("GET"));
    }
}

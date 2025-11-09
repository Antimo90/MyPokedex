package antimomandorino.mypokedex.security;

import antimomandorino.mypokedex.entities.User;
import antimomandorino.mypokedex.exceptions.UnauthorizedException;
import io.jsonwebtoken.JwtException;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import java.util.Date;

@Component
public class JWTTools {

    @Value("${jwt.secret}")
    private String keySecret;

    //Crea un nuovo JWT per l'utente specificato.
    public String createToken(User user) {
        // Avvio la costruzione del token.
        return Jwts.builder()
                // Imposto la data di emissione (quando è stato creato).
                .issuedAt(new Date(System.currentTimeMillis()))
                // Imposto la data di scadenza (7 giorni da adesso).
                .expiration(new Date(System.currentTimeMillis() + 1000 * 60 * 60 * 24 * 7))
                // Imposto il "soggetto" del token: l'ID dell'utente (usato per identificare chi è autenticato).
                .subject(String.valueOf(user.getIdUser()))
                // Firmo il token usando l'algoritmo HMAC e la chiave segreta.
                .signWith(Keys.hmacShaKeyFor(keySecret.getBytes()))
                // Genero la stringa finale del token.
                .compact();
    }

    //Verifica che il token sia valido (non manipolato e non scaduto).
    public void verifyToken(String accessToken) {
        try {
            // Avvio il parser del token.
            Jwts.parser()
                    // Verifico la firma usando la chiave segreta.
                    .verifyWith(Keys.hmacShaKeyFor(keySecret.getBytes()))
                    // Creo l'istanza del parser.
                    .build().parse(accessToken);
        } catch (JwtException ex) {
            // Se la verifica fallisce (scaduto, firma errata, ecc.), lancio un'eccezione custom.
            throw new UnauthorizedException("Invalid or expired token. Please sign in again.");
        }
    }

    //Estrae l'ID utente (soggetto) dal token verificato.
    public Long exctractIdFromToken(String accessToken) {
        try {
            // Eseguo il parsing e la verifica, estraggo il payload, prendo il Subject (che è l'ID utente)
            // e lo converto in Long.
            return Long.parseLong(Jwts.parser()
                    .verifyWith(Keys.hmacShaKeyFor(keySecret.getBytes()))
                    .build().parseSignedClaims(accessToken).getPayload().getSubject());
        } catch (JwtException ex) {
            // Se il token non può essere decifrato o l'ID non è un numero, lancio un errore.
            throw new UnauthorizedException("Invalid user ID in token.");
        }
    }
}
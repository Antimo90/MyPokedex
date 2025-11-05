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

    public String createToken(User user) {
        return Jwts.builder()
                .issuedAt(new Date(System.currentTimeMillis()))
                .expiration(new Date(System.currentTimeMillis() + 1000 * 60 * 60 * 24 * 7))
                .subject(String.valueOf(user.getIdUser()))
                .signWith(Keys.hmacShaKeyFor(keySecret.getBytes()))
                .compact();
    }

    public void verifyToken(String accessToken) {
        try {
            Jwts.parser()
                    .verifyWith(Keys.hmacShaKeyFor(keySecret.getBytes()))
                    .build().parse(accessToken);
        } catch (JwtException ex) {
            throw new UnauthorizedException("Invalid or expired token. Please sign in again.");
        }
    }

    public Long exctractIdFromToken(String accessToken) {
        try {
            return Long.parseLong(Jwts.parser()
                    .verifyWith(Keys.hmacShaKeyFor(keySecret.getBytes()))
                    .build().parseSignedClaims(accessToken).getPayload().getSubject());
        } catch (JwtException ex) {
            throw new UnauthorizedException("Invalid user ID in token.");
        }
    }
}

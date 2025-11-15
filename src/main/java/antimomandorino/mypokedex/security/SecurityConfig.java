package antimomandorino.mypokedex.security;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.List;

@Configuration
@EnableMethodSecurity
@EnableWebSecurity
public class SecurityConfig {


    @Bean
    SecurityFilterChain securityFilterChain(HttpSecurity httpSecurity) throws Exception {

        // 1. Disabilitazione dell'autenticazione basata sul form di default di Spring Security
        httpSecurity.formLogin(formLogin -> formLogin.disable());
        // 2. Disattivazione della protezione CSRF
        httpSecurity.csrf(csrf -> csrf.disable());
        // 3. Disabilitazione delle sessioni: l'API è stateless, l'autenticazione sarà gestita da token.
        httpSecurity.sessionManagement(sessions -> sessions.sessionCreationPolicy(SessionCreationPolicy.STATELESS));
        httpSecurity.authorizeHttpRequests(req -> req.requestMatchers("/auths/**").permitAll().anyRequest().authenticated());


        // Configurazione di default per il collegamento con il FRONT_END (per gestire le richieste CORS).
        httpSecurity.cors(Customizer.withDefaults());

        // Restituisco la catena di filtri configurata.
        return httpSecurity.build();
    }

    // Bcrypt per la sicurezza delle password per gli utenti
    @Bean
    public PasswordEncoder getBcrypt() {
        // Uso un'intensità di 12 (più sicuro del default, ma non eccessivamente lento).
        return new BCryptPasswordEncoder(12);
    }

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();
        configuration.setAllowedOrigins(List.of("http://localhost:5173"));
        configuration.setAllowedMethods(List.of("GET", "POST", "PUT", "DELETE", "PATCH"));
        configuration.setAllowedHeaders(List.of("*"));
        configuration.setAllowCredentials(true);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);
        return source;
    }

}
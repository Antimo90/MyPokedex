package antimomandorino.mypokedex.services;

import antimomandorino.mypokedex.entities.Pokemon;
import antimomandorino.mypokedex.entities.User;
import antimomandorino.mypokedex.entities.UserPokemon;
import antimomandorino.mypokedex.exceptions.NotFoundException;
import antimomandorino.mypokedex.repositories.UserPokemonRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class UserPokemonService {

    @Autowired
    private UserPokemonRepository userPokemonRepository;

    @Autowired
    private UserService userService;

    @Autowired
    private PokemonService pokemonService;

    // Ottiene tutti i record di cattura di un utente
    public List<UserPokemon> findAllCapturesByUserId(Long userId) {
        User user = userService.findUserById(userId);
        return userPokemonRepository.findByUser(user);
    }

    //Segna un Pokémon come "Catturato" o "Shiny Catturato" per l'utente.
    public UserPokemon markAsCaptured(Long userId, int pokemonId, boolean isShiny) {
        User user = userService.findUserById(userId);
        Pokemon pokemon = pokemonService.findPokemonById(pokemonId);

        // Controlla se il record di cattura esiste già
        Optional<UserPokemon> existing = userPokemonRepository.findByUserAndPokemonAndIsShiny(user, pokemon, isShiny);

        if (existing.isPresent()) {
            // Se esiste, lo restituisce semplicemente già segnato
            return existing.get();
        }

        // Se non esiste, crea il nuovo record di stato
        UserPokemon newUserPokemon = new UserPokemon(user, pokemon, isShiny);
        return userPokemonRepository.save(newUserPokemon);
    }

    //Segna un Pokémon come "Non Catturato" eliminando il record di stato.
    public void markAsUncaptured(Long userId, int pokemonId, boolean isShiny) {
        User user = userService.findUserById(userId);
        Pokemon pokemon = pokemonService.findPokemonById(pokemonId);

        // Trova il record specifico (normale o shiny) da eliminare
        Optional<UserPokemon> found = userPokemonRepository.findByUserAndPokemonAndIsShiny(user, pokemon, isShiny);

        if (found.isEmpty()) {
            // Se non c'è, non c'è nulla da eliminare
            throw new NotFoundException("This Pokémon is not marked as captured by the user.");
        }

        userPokemonRepository.delete(found.get());
    }


}



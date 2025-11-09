package antimomandorino.mypokedex.services;

import antimomandorino.mypokedex.entities.Pokemon;
import antimomandorino.mypokedex.entities.Stat;
import antimomandorino.mypokedex.exceptions.NotFoundException;
import antimomandorino.mypokedex.payloads.StatDTO;
import antimomandorino.mypokedex.repositories.StatRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class StatService {

    @Autowired
    private StatRepository statRepository;

    //Trova le statistiche di un Pokémon usando l'ID del Pokémon
    public Stat findStatByPokemonId(int idPokemon) {
        // Cerco per ID o lancio un'eccezione NotFoundException se le statistiche non esistono.
        return statRepository.findById(idPokemon)
                .orElseThrow(() -> new NotFoundException("Stats not found for Pokemon ID " + idPokemon));
    }

    //Crea un nuovo set di statistiche per un Pokémon.
    public Stat createStat(StatDTO payload, Pokemon pokemon) {

        // Calcolo la somma di tutte le statistiche per ottenere il valore totale (totalStats).
        int totalStats = payload.hp() + payload.attack() + payload.defense()
                + payload.specialAttack() + payload.specialDefense() + payload.speed();

        // Creo la nuova istanza di Stat usando i dati del payload e il totale calcolato.
        Stat newStat = new Stat(
                payload.hp(),
                payload.attack(),
                payload.defense(),
                payload.specialAttack(),
                payload.specialDefense(),
                payload.speed(),
                totalStats
        );

        // Associo il nuovo oggetto Stat all'oggetto Pokemon (gestione della relazione).
        pokemon.setStats(newStat);

        // Salvo il nuovo set di statistiche nel database.
        return statRepository.save(newStat);
    }
}
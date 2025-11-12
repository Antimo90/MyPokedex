package antimomandorino.mypokedex.repositories;

import antimomandorino.mypokedex.entities.Pokemon;
import antimomandorino.mypokedex.entities.User;
import antimomandorino.mypokedex.entities.UserPokemon;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface UserPokemonRepository extends JpaRepository<UserPokemon, Long> {

    List<UserPokemon> findByUser(User user);

    Optional<UserPokemon> findByUserAndPokemonAndIsShiny(User user, Pokemon pokemon, Boolean isShiny);
}
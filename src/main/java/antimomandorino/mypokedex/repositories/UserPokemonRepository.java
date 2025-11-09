package antimomandorino.mypokedex.repositories;

import antimomandorino.mypokedex.entities.UserPokemon;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface UserPokemonRepository extends JpaRepository<UserPokemon, Long> {
}
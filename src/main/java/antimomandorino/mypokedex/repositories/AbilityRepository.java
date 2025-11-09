package antimomandorino.mypokedex.repositories;

import antimomandorino.mypokedex.entities.Ability;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface AbilityRepository extends JpaRepository<Ability, Long> {

    Optional<Ability> findByName(String name);
}
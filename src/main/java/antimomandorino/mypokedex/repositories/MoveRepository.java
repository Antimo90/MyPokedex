package antimomandorino.mypokedex.repositories;

import antimomandorino.mypokedex.entities.Move;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface MoveRepository extends JpaRepository<Move, Integer> {

    Optional<Move> findByName(String name);
}
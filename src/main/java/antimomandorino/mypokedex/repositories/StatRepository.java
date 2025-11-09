package antimomandorino.mypokedex.repositories;

import antimomandorino.mypokedex.entities.Stat;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface StatRepository extends JpaRepository<Stat, Integer> {
}
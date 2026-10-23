package cl.temuco.nexora.catalog;

import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;

public interface OfferingRepository extends JpaRepository<Offering, Long> {

    List<Offering> findByBusinessIdOrderByIdAsc(Long businessId);
}

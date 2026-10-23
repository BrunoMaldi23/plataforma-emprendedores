package cl.temuco.nexora.opportunities;

import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;

public interface OpportunityRepository extends JpaRepository<Opportunity, Long> {

    List<Opportunity> findByPublishedTrueOrderByStartDateAsc();

    List<Opportunity> findByPublishedTrueAndTypeOrderByStartDateAsc(OpportunityType type);

    Optional<Opportunity> findBySlugAndPublishedTrue(String slug);
}

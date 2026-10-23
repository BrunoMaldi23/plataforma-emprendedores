package cl.temuco.nexora.opportunities;

import java.util.List;
import java.util.Optional;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Transactional(readOnly = true)
public class OpportunityService {

    private final OpportunityRepository repository;

    public OpportunityService(OpportunityRepository repository) {
        this.repository = repository;
    }

    /** Solo oportunidades publicadas, opcionalmente filtradas por categoría. */
    public List<OpportunityDto> listPublished(Optional<OpportunityType> type) {
        List<Opportunity> items = type
                .map(repository::findByPublishedTrueAndTypeOrderByStartDateAsc)
                .orElseGet(repository::findByPublishedTrueOrderByStartDateAsc);
        return items.stream().map(OpportunityDto::of).toList();
    }

    public Optional<OpportunityDto> findBySlug(String slug) {
        return repository.findBySlugAndPublishedTrue(slug).map(OpportunityDto::of);
    }
}

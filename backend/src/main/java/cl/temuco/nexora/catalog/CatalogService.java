package cl.temuco.nexora.catalog;

import cl.temuco.nexora.catalog.CatalogDtos.BusinessDetailDto;
import cl.temuco.nexora.catalog.CatalogDtos.BusinessDto;
import cl.temuco.nexora.catalog.CatalogDtos.CategoryDto;
import cl.temuco.nexora.catalog.CatalogDtos.OfferingDto;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Transactional(readOnly = true)
public class CatalogService {

    private final BusinessRepository businesses;
    private final CategoryRepository categories;
    private final OfferingRepository offerings;

    public CatalogService(BusinessRepository businesses, CategoryRepository categories, OfferingRepository offerings) {
        this.businesses = businesses;
        this.categories = categories;
        this.offerings = offerings;
    }

    public List<CategoryDto> listCategories() {
        return categories.findAllByOrderByNameAsc().stream().map(CategoryDto::of).toList();
    }

    /**
     * Solo negocios aprobados. Categoría y sector se filtran en SQL; el texto se filtra en memoria
     * con la misma regla del frontend (sin tildes, todos los términos). Suficiente para el volumen del piloto;
     * si el catálogo crece, mover a búsqueda de texto completo de PostgreSQL.
     */
    public List<BusinessDto> search(String query, String category, String location) {
        Specification<Business> spec = (root, q, cb) -> cb.equal(root.get("status"), ReviewStatus.APPROVED);
        if (category != null && !category.isBlank()) {
            spec = spec.and((root, q, cb) -> cb.equal(root.get("categoryId"), category));
        }
        if (location != null && !location.isBlank()) {
            spec = spec.and((root, q, cb) -> cb.equal(root.get("location"), location));
        }
        List<String> terms = BusinessSearch.terms(query);
        List<BusinessDto> result = new ArrayList<>();
        for (Business b : businesses.findAll(spec, Sort.by("name"))) {
            if (BusinessSearch.matches(b, terms)) {
                result.add(BusinessDto.of(b));
            }
        }
        return result;
    }

    public Optional<BusinessDetailDto> findBySlug(String slug) {
        return businesses.findBySlugAndStatus(slug, ReviewStatus.APPROVED).map(b -> new BusinessDetailDto(
                BusinessDto.of(b),
                offerings.findByBusinessIdOrderByIdAsc(b.getId()).stream().map(OfferingDto::of).toList()));
    }
}

package cl.temuco.nexora.catalog;

import java.util.Comparator;
import java.util.List;

/** Contratos JSON públicos. Coinciden con los tipos de src/types del frontend. */
public final class CatalogDtos {

    private CatalogDtos() {
    }

    public record CategoryDto(String id, String name, String description) {
        static CategoryDto of(Category c) {
            return new CategoryDto(c.getId(), c.getName(), c.getDescription());
        }
    }

    public record BusinessDto(
            String id,
            String slug,
            String name,
            String tagline,
            String description,
            String categoryId,
            String location,
            List<String> tags,
            String contactEmail,
            String instagram,
            int foundedYear,
            String status) {
        static BusinessDto of(Business b) {
            return new BusinessDto(
                    String.valueOf(b.getId()), b.getSlug(), b.getName(), b.getTagline(), b.getDescription(),
                    b.getCategoryId(), b.getLocation(),
                    b.getTags().stream().sorted(Comparator.naturalOrder()).toList(),
                    b.getContactEmail(), b.getInstagram(), b.getFoundedYear(), b.getStatus().wire());
        }
    }

    public record OfferingDto(String id, String kind, String name, String description, Integer priceClp) {
        static OfferingDto of(Offering o) {
            return new OfferingDto(String.valueOf(o.getId()), o.getKind().wire(), o.getName(), o.getDescription(),
                    o.getPriceClp());
        }
    }

    public record BusinessDetailDto(BusinessDto business, List<OfferingDto> offerings) {
    }
}

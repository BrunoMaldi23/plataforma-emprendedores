package cl.temuco.nexora.catalog;

import static org.assertj.core.api.Assertions.assertThat;

import cl.temuco.nexora.shared.TextNormalizer;
import java.util.List;
import java.util.Set;
import org.junit.jupiter.api.Test;
import org.springframework.test.util.ReflectionTestUtils;

class BusinessSearchTest {

    private static Business business(String name, String tagline, String description, Set<String> tags) {
        Business b = new Business();
        ReflectionTestUtils.setField(b, "name", name);
        ReflectionTestUtils.setField(b, "tagline", tagline);
        ReflectionTestUtils.setField(b, "description", description);
        ReflectionTestUtils.setField(b, "tags", tags);
        return b;
    }

    private final Business cafe = business("Café del Volcán", "Café de especialidad", "Tostaduría pequeña",
            Set.of("café", "oficinas"));

    @Test
    void normalizeRemovesAccentsAndCase() {
        assertThat(TextNormalizer.normalize("  CAFÉ Volcán ")).isEqualTo("cafe volcan");
        assertThat(TextNormalizer.normalize(null)).isEmpty();
    }

    @Test
    void matchesIgnoringAccents() {
        assertThat(BusinessSearch.matches(cafe, BusinessSearch.terms("cafe"))).isTrue();
        assertThat(BusinessSearch.matches(cafe, BusinessSearch.terms("VOLCAN"))).isTrue();
    }

    @Test
    void requiresAllTerms() {
        assertThat(BusinessSearch.matches(cafe, BusinessSearch.terms("cafe oficinas"))).isTrue();
        assertThat(BusinessSearch.matches(cafe, BusinessSearch.terms("cafe ceramica"))).isFalse();
    }

    @Test
    void emptyQueryMatchesEverything() {
        assertThat(BusinessSearch.terms("   ")).isEmpty();
        assertThat(BusinessSearch.matches(cafe, List.of())).isTrue();
    }
}

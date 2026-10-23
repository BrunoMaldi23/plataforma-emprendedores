package cl.temuco.nexora.catalog;

import cl.temuco.nexora.shared.TextNormalizer;
import java.util.Arrays;
import java.util.List;
import java.util.stream.Stream;

/** Regla de búsqueda del catálogo: todos los términos deben aparecer en nombre, frase, descripción o etiquetas. */
public final class BusinessSearch {

    private BusinessSearch() {
    }

    public static List<String> terms(String query) {
        String normalized = TextNormalizer.normalize(query);
        return normalized.isEmpty() ? List.of() : Arrays.asList(normalized.split("\\s+"));
    }

    public static boolean matches(Business business, List<String> terms) {
        if (terms.isEmpty()) {
            return true;
        }
        String haystack = TextNormalizer.normalize(String.join(" ",
                Stream.concat(
                        Stream.of(business.getName(), business.getTagline(), business.getDescription()),
                        business.getTags().stream()).toList()));
        return terms.stream().allMatch(haystack::contains);
    }
}

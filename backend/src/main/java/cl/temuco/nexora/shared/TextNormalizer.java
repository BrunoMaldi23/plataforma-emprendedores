package cl.temuco.nexora.shared;

import java.text.Normalizer;
import java.util.Locale;
import java.util.regex.Pattern;

/** Normaliza texto para búsquedas tolerantes: minúsculas y sin tildes. */
public final class TextNormalizer {

    private static final Pattern MARKS = Pattern.compile("\\p{M}+");

    private TextNormalizer() {
    }

    public static String normalize(String value) {
        if (value == null) {
            return "";
        }
        String decomposed = Normalizer.normalize(value.toLowerCase(Locale.ROOT), Normalizer.Form.NFD);
        return MARKS.matcher(decomposed).replaceAll("").strip();
    }
}

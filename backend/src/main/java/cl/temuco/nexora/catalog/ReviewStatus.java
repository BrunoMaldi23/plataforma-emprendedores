package cl.temuco.nexora.catalog;

import java.util.Locale;

public enum ReviewStatus {
    APPROVED, PENDING, HIDDEN;

    /** Valor que expone la API (coincide con los tipos del frontend). */
    public String wire() {
        return name().toLowerCase(Locale.ROOT);
    }
}

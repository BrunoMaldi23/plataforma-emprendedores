package cl.temuco.nexora.opportunities;

import java.util.Locale;
import java.util.Optional;

public enum OpportunityType {
    FERIA, CAPACITACION, PROGRAMA, FONDO, CONVOCATORIA;

    public String wire() {
        return name().toLowerCase(Locale.ROOT);
    }

    public static Optional<OpportunityType> fromWire(String value) {
        try {
            return Optional.of(valueOf(value.trim().toUpperCase(Locale.ROOT)));
        } catch (IllegalArgumentException e) {
            return Optional.empty();
        }
    }
}

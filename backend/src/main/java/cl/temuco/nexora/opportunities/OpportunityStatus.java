package cl.temuco.nexora.opportunities;

import java.util.Locale;

/** Estado fijo en datos; no se deriva de la fecha actual (igual que en el frontend). */
public enum OpportunityStatus {
    OPEN, UPCOMING, CLOSED;

    public String wire() {
        return name().toLowerCase(Locale.ROOT);
    }
}

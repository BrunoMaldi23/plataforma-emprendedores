package cl.temuco.nexora.catalog;

import java.util.Locale;

public enum OfferingKind {
    PRODUCT, SERVICE;

    public String wire() {
        return name().toLowerCase(Locale.ROOT);
    }
}

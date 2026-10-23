package cl.temuco.nexora.catalog;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table(name = "offering")
public class Offering {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @Column(name = "business_id")
    private Long businessId;
    @Enumerated(EnumType.STRING)
    private OfferingKind kind;
    private String name;
    private String description;
    @Column(name = "price_clp")
    private Integer priceClp;

    protected Offering() {
    }

    public Long getId() {
        return id;
    }

    public Long getBusinessId() {
        return businessId;
    }

    public OfferingKind getKind() {
        return kind;
    }

    public String getName() {
        return name;
    }

    public String getDescription() {
        return description;
    }

    public Integer getPriceClp() {
        return priceClp;
    }
}

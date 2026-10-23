package cl.temuco.nexora.opportunities;

import jakarta.persistence.CollectionTable;
import jakarta.persistence.Column;
import jakarta.persistence.ElementCollection;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.OrderColumn;
import jakarta.persistence.Table;
import java.time.LocalDate;
import java.util.List;
import org.hibernate.annotations.BatchSize;

@Entity
@Table(name = "opportunity")
public class Opportunity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String slug;
    private String title;
    @Enumerated(EnumType.STRING)
    private OpportunityType type;
    private String summary;
    private String description;
    private String organization;
    @Column(name = "start_date")
    private LocalDate startDate;
    private LocalDate deadline;
    private String url;
    @Enumerated(EnumType.STRING)
    private OpportunityStatus status;
    private boolean published;

    @ElementCollection
    @CollectionTable(name = "opportunity_requirement", joinColumns = @JoinColumn(name = "opportunity_id"))
    @OrderColumn(name = "position")
    @Column(name = "text")
    @BatchSize(size = 50)
    private List<String> requirements;

    protected Opportunity() {
    }

    public Long getId() {
        return id;
    }

    public String getSlug() {
        return slug;
    }

    public String getTitle() {
        return title;
    }

    public OpportunityType getType() {
        return type;
    }

    public String getSummary() {
        return summary;
    }

    public String getDescription() {
        return description;
    }

    public String getOrganization() {
        return organization;
    }

    public LocalDate getStartDate() {
        return startDate;
    }

    public LocalDate getDeadline() {
        return deadline;
    }

    public String getUrl() {
        return url;
    }

    public OpportunityStatus getStatus() {
        return status;
    }

    public boolean isPublished() {
        return published;
    }

    public List<String> getRequirements() {
        return requirements;
    }
}

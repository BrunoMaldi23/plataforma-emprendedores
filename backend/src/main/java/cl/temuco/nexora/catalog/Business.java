package cl.temuco.nexora.catalog;

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
import jakarta.persistence.Table;
import java.util.Set;
import org.hibernate.annotations.BatchSize;

@Entity
@Table(name = "business")
public class Business {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String slug;
    private String name;
    private String tagline;
    private String description;
    @Column(name = "category_id")
    private String categoryId;
    private String location;
    @Column(name = "contact_email")
    private String contactEmail;
    private String instagram;
    @Column(name = "founded_year")
    private int foundedYear;
    @Enumerated(EnumType.STRING)
    private ReviewStatus status;

    @ElementCollection
    @CollectionTable(name = "business_tag", joinColumns = @JoinColumn(name = "business_id"))
    @Column(name = "tag")
    @BatchSize(size = 50)
    private Set<String> tags;

    protected Business() {
    }

    public Long getId() {
        return id;
    }

    public String getSlug() {
        return slug;
    }

    public String getName() {
        return name;
    }

    public String getTagline() {
        return tagline;
    }

    public String getDescription() {
        return description;
    }

    public String getCategoryId() {
        return categoryId;
    }

    public String getLocation() {
        return location;
    }

    public String getContactEmail() {
        return contactEmail;
    }

    public String getInstagram() {
        return instagram;
    }

    public int getFoundedYear() {
        return foundedYear;
    }

    public ReviewStatus getStatus() {
        return status;
    }

    public Set<String> getTags() {
        return tags;
    }
}

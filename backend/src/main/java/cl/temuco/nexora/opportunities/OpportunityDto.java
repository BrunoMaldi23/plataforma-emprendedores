package cl.temuco.nexora.opportunities;

import java.time.LocalDate;
import java.util.List;

/** Contrato JSON público; coincide con el tipo Opportunity del frontend. */
public record OpportunityDto(
        String id,
        String slug,
        String title,
        String type,
        String summary,
        String description,
        String organization,
        LocalDate startDate,
        LocalDate deadline,
        List<String> requirements,
        String url,
        String status,
        boolean published) {

    static OpportunityDto of(Opportunity o) {
        return new OpportunityDto(String.valueOf(o.getId()), o.getSlug(), o.getTitle(), o.getType().wire(),
                o.getSummary(), o.getDescription(), o.getOrganization(), o.getStartDate(), o.getDeadline(),
                List.copyOf(o.getRequirements()), o.getUrl(), o.getStatus().wire(), o.isPublished());
    }
}

package cl.temuco.nexora.opportunities;

import java.util.List;
import java.util.Optional;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;

@RestController
@RequestMapping("/api/opportunities")
public class OpportunityController {

    private final OpportunityService service;

    public OpportunityController(OpportunityService service) {
        this.service = service;
    }

    @GetMapping
    public List<OpportunityDto> list(@RequestParam(required = false) String type) {
        Optional<OpportunityType> parsed = Optional.empty();
        if (type != null && !type.isBlank()) {
            parsed = Optional.of(OpportunityType.fromWire(type).orElseThrow(
                    () -> new ResponseStatusException(HttpStatus.BAD_REQUEST, "Categoría de oportunidad no válida")));
        }
        return service.listPublished(parsed);
    }

    @GetMapping("/{slug}")
    public OpportunityDto get(@PathVariable String slug) {
        return service.findBySlug(slug)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Oportunidad no encontrada"));
    }
}

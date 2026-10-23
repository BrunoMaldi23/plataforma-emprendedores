package cl.temuco.nexora.catalog;

import cl.temuco.nexora.catalog.CatalogDtos.BusinessDetailDto;
import cl.temuco.nexora.catalog.CatalogDtos.BusinessDto;
import cl.temuco.nexora.catalog.CatalogDtos.CategoryDto;
import java.util.List;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;

@RestController
@RequestMapping("/api")
public class CatalogController {

    private final CatalogService service;

    public CatalogController(CatalogService service) {
        this.service = service;
    }

    @GetMapping("/categories")
    public List<CategoryDto> categories() {
        return service.listCategories();
    }

    @GetMapping("/businesses")
    public List<BusinessDto> businesses(
            @RequestParam(required = false) String q,
            @RequestParam(required = false) String category,
            @RequestParam(required = false) String location) {
        return service.search(q, category, location);
    }

    @GetMapping("/businesses/{slug}")
    public BusinessDetailDto business(@PathVariable String slug) {
        return service.findBySlug(slug)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Emprendimiento no encontrado"));
    }
}

package antimomandorino.mypokedex.controllers;

import antimomandorino.mypokedex.entities.Type;
import antimomandorino.mypokedex.services.TypeService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/types")
public class TypeController {

    @Autowired
    private TypeService typeService;


    @GetMapping
    @PreAuthorize("hasAnyAuthority('ADMIN', 'USER')")
    public List<Type> getAllTypes() {
        return this.typeService.findAllTypes();
    }

    @GetMapping("/{idType}")
    @PreAuthorize("hasAnyAuthority('ADMIN', 'USER')")
    public Type getSingleType(@PathVariable String name) {
        return this.typeService.findByName(name);
    }
}

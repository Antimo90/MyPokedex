package antimomandorino.mypokedex.controllers;

import antimomandorino.mypokedex.entities.Ability;
import antimomandorino.mypokedex.services.AbilityService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/abilities")
public class AbilityController {

    @Autowired
    private AbilityService abilityService;

    @GetMapping
    @PreAuthorize("hasAnyAuthority('ADMIN', 'USER')")
    public Page<Ability> getAllAbilities(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "idAbility") String sort
    ) {

        return this.abilityService.findAllAbility(page, size, sort);
    }

    @GetMapping("/{idAbility}")
    @PreAuthorize("hasAnyAuthority('ADMIN', 'USER')")
    public Ability getSingleAbility(@PathVariable String name) {
        return this.abilityService.findByName(name);
    }
}

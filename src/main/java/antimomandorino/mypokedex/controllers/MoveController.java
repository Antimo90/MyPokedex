package antimomandorino.mypokedex.controllers;

import antimomandorino.mypokedex.entities.Move;
import antimomandorino.mypokedex.services.MoveService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/moves")
public class MoveController {

    @Autowired
    private MoveService moveService;

    @GetMapping
    @PreAuthorize("hasAnyAuthority('ADMIN','USER')")
    public Page<Move> getAllMoves(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "idMove") String sort) {

        return this.moveService.findAllMoves(page, size, sort);
    }


    @GetMapping("/{moveIdentifier}")
    @PreAuthorize("hasAnyAuthority('ADMIN', 'USER')")
    public Move getSingleMove(@PathVariable("moveIdentifier") String name) {
        return this.moveService.findByName(name);
    }
}

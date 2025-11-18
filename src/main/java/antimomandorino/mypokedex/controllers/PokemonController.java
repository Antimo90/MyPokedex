package antimomandorino.mypokedex.controllers;

import antimomandorino.mypokedex.entities.Pokemon;
import antimomandorino.mypokedex.services.PokemonService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/pokemon")
public class PokemonController {

    @Autowired
    private PokemonService pokemonService;

    //http://localhost:3001/pokemon/{idPokemon}/sprites
    @PatchMapping("/{idPokemon}/sprites")
    @PreAuthorize("hasAuthority('ADMIN')")
    @ResponseStatus(HttpStatus.OK)
    public Pokemon uploadPokemonSprites(
            @PathVariable int idPokemon,
            @RequestParam("spriteUrl") MultipartFile spriteFile,
            @RequestParam("spriteShinyUrl") MultipartFile spriteShinyFile
    ) {
        Pokemon updatedPokemon = this.pokemonService.updateSpriteUrls(
                idPokemon,
                spriteFile,
                spriteShinyFile
        );

        return updatedPokemon;
    }

    @GetMapping("/{idPokemon}")
    @PreAuthorize("hasAnyAuthority('ADMIN','USER')")
    public Pokemon getSinglePokemon(@PathVariable int idPokemon) {
        return this.pokemonService.findPokemonById(idPokemon);
    }

    @GetMapping
    @PreAuthorize("hasAnyAuthority('ADMIN', 'USER')")
    public Page<Pokemon> getAllPokemon(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "idPokemon") String sort) {

        return this.pokemonService.findAllPokemon(page, size, sort);
    }

    @DeleteMapping("/{idPokemon}")
    @PreAuthorize("hasAuthority('ADMIN')")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deletePokemon(@PathVariable int idPokemon) {
        this.pokemonService.deletePokemon(idPokemon);
    }
}

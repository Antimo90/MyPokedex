package antimomandorino.mypokedex.controllers;

import antimomandorino.mypokedex.entities.Pokemon;
import antimomandorino.mypokedex.services.PokemonService;
import org.springframework.beans.factory.annotation.Autowired;
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
    @PreAuthorize("hasAnyAuthority('ADMIN')")
    @ResponseStatus(HttpStatus.OK)
    public Pokemon uploadPokemonSprites(
            @PathVariable int idPokemon,
            @RequestParam("spriteUrl") MultipartFile spriteFile,
            @RequestParam("spriteShinyUrl") MultipartFile spriteShinyFile
    ) {
        Pokemon updatedPokemon = pokemonService.updateSpriteUrls(
                idPokemon,
                spriteFile,
                spriteShinyFile
        );

        return updatedPokemon;
    }

    @GetMapping("/{idPokemon}")
    @PreAuthorize("hasAnyAuthority('ADMIN','USER')")
    public Pokemon getSinglePokemon(@PathVariable int idPokemon) {
        return pokemonService.findPokemonById(idPokemon);
    }
}

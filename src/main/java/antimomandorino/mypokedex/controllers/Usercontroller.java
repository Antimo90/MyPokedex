package antimomandorino.mypokedex.controllers;

import antimomandorino.mypokedex.entities.User;
import antimomandorino.mypokedex.entities.UserPokemon;
import antimomandorino.mypokedex.exceptions.ValidationException;
import antimomandorino.mypokedex.payloads.UserPasswordChangeDTO;
import antimomandorino.mypokedex.payloads.UserPokemonRequestDTO;
import antimomandorino.mypokedex.payloads.UserRegistrationDTO;
import antimomandorino.mypokedex.services.UserPokemonService;
import antimomandorino.mypokedex.services.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.validation.BindingResult;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/user/pokemon")
public class Usercontroller {

    @Autowired
    private UserPokemonService userPokemonService;

    @Autowired
    private UserService userService;

    // --- ENDPOINTS PERSONALI (ACCESSIBILI SOLO ALL'UTENTE AUTENTICATO) ---

    // Ottiene i dati dell'utente autenticato
    @GetMapping("/me")
    public User getProfile(@AuthenticationPrincipal User authenticatedUser) {
        // L'oggetto User è iniettato direttamente dal contesto di sicurezza
        return authenticatedUser;
    }

    // Modifica username ed email dell'utente autenticato
    @PutMapping("/me")
    public User updateProfile(@AuthenticationPrincipal User authenticatedUser,
                              @RequestBody @Validated UserRegistrationDTO body,
                              BindingResult validationResult) {
        if (validationResult.hasErrors()) {
            throw new ValidationException(validationResult.getFieldErrors().stream().map(e -> e.getDefaultMessage()).toList());
        }
        return userService.updateUser(authenticatedUser.getIdUser(), body);
    }

    // Aggiorna la password dell'utente autenticato
    @PatchMapping("/me/password")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void changePassword(@AuthenticationPrincipal User authenticatedUser,
                               @RequestBody @Validated UserPasswordChangeDTO body,
                               BindingResult validationResult) {
        if (validationResult.hasErrors()) {
            throw new ValidationException(validationResult.getFieldErrors().stream().map(e -> e.getDefaultMessage()).toList());
        }
        userService.updatePassword(authenticatedUser.getIdUser(), body);
    }

    // Ottiene la collezione (i Pokémon catturati) dell'utente
    @GetMapping("/me/collection")
    public List<UserPokemon> getMyCollection(@AuthenticationPrincipal User authenticatedUser) {
        return userPokemonService.findAllCapturesByUserId(authenticatedUser.getIdUser());
    }

    // Segna un Pokémon come catturato (normale o shiny)
    @PostMapping("/me/collection")
    @ResponseStatus(HttpStatus.CREATED)
    public UserPokemon markPokemonCaptured(@AuthenticationPrincipal User authenticatedUser,
                                           @RequestBody @Validated UserPokemonRequestDTO body,
                                           BindingResult validationResult) {
        if (validationResult.hasErrors()) {
            throw new ValidationException(validationResult.getFieldErrors().stream().map(e -> e.getDefaultMessage()).toList());
        }
        return userPokemonService.markAsCaptured(
                authenticatedUser.getIdUser(),
                body.pokemonId(),
                body.isShiny() != null ? body.isShiny() : false // Default a non-shiny
        );
    }

    // Rilascia un Pokémon (segna come non catturato)
    @DeleteMapping("/me/collection")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void markPokemonUncaptured(@AuthenticationPrincipal User authenticatedUser,
                                      @RequestBody @Validated UserPokemonRequestDTO body,
                                      BindingResult validationResult) {
        if (validationResult.hasErrors()) {
            throw new ValidationException(validationResult.getFieldErrors().stream().map(e -> e.getDefaultMessage()).toList());
        }
        userPokemonService.markAsUncaptured(
                authenticatedUser.getIdUser(),
                body.pokemonId(),
                body.isShiny() != null ? body.isShiny() : false
        );
    }

    // Permette all'utente di cambiare il proprio avatar
    @PatchMapping("/me/avatar")
    public User updateMyAvatar(@AuthenticationPrincipal User authenticatedUser,
                               @RequestBody @Validated UserPokemonRequestDTO body,
                               BindingResult validationResult) {
        if (validationResult.hasErrors()) {
            throw new ValidationException(validationResult.getFieldErrors().stream().map(e -> e.getDefaultMessage()).toList());
        }

        // isShiny può essere null nel DTO, lo trattiamo come false
        boolean isShiny = body.isShiny() != null ? body.isShiny() : false;

        return userService.updateAvatar(authenticatedUser.getIdUser(), body.pokemonId(), isShiny);
    }

    // --- ENDPOINTS AMMINISTRATIVI  ---

    // Ottiene la lista paginata di tutti gli utenti
    @GetMapping
    @PreAuthorize("hasAuthority('ADMIN')")
    public Page<User> getAllUsers(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "idUser") String sort) {
        return userService.findAllUser(page, size, sort);
    }

    // Ottiene un utente per ID
    @GetMapping("/{idUser}")
    @PreAuthorize("hasAuthority('ADMIN')")
    public User getSingleUser(@PathVariable Long idUser) {
        return userService.findUserById(idUser);
    }

    // Elimina un utente per ID
    @DeleteMapping("/{idUser}")
    @PreAuthorize("hasAuthority('ADMIN')")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deleteUser(@PathVariable Long idUser) {
        userService.deleteUser(idUser);
    }
}

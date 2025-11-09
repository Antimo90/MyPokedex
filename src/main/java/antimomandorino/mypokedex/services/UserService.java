package antimomandorino.mypokedex.services;

import antimomandorino.mypokedex.entities.Role;
import antimomandorino.mypokedex.entities.User;
import antimomandorino.mypokedex.entities.UserPokemon;
import antimomandorino.mypokedex.exceptions.BadRequestException;
import antimomandorino.mypokedex.exceptions.NotFoundException;
import antimomandorino.mypokedex.exceptions.UnauthorizedException;
import antimomandorino.mypokedex.payloads.UserPasswordChangeDTO;
import antimomandorino.mypokedex.payloads.UserRegistrationDTO;
import antimomandorino.mypokedex.repositories.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Collections;
import java.util.HashSet;
import java.util.Set;

@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder bcrypt;

    @Autowired
    private RoleService roleService;

    // Trova un utente tramite il suo ID.
    public User findUserById(Long idUser) {
        // Cerco l'utente per ID e, se non esiste, lancio un'eccezione NotFoundException.
        return this.userRepository.findById(idUser)
                .orElseThrow(() -> new NotFoundException("User not found with ID " + idUser));
    }

    // Restituisce una pagina di tutti gli utenti, con supporto per paginazione e ordinamento.
    public Page<User> findAllUser(int pageNumber, int pageSize, String sortBy) {
        // Limito la dimensione massima della pagina.
        if (pageSize > 50) pageSize = 50;
        // Creo un oggetto Pageable con paginazione e ordinamento.
        Pageable pageable = PageRequest.of(pageNumber, pageSize, Sort.by(sortBy).ascending());
        return this.userRepository.findAll(pageable);
    }

    //  Salva un nuovo utente nel database.
    public User saveUser(UserRegistrationDTO payload) {

        // Controllo se l'email è già in uso e, in tal caso, lancio un errore.
        this.userRepository.findByEmail(payload.email()).ifPresent(utente -> {
            throw new BadRequestException("The e-mail " + utente.getEmail() + " is already in use.");
        });

        // Controllo se l'username è già in uso e, in tal caso, lancio un errore.
        this.userRepository.findByUsername(payload.username()).ifPresent(utente -> {
            throw new BadRequestException("The username " + utente.getUsername() + " is already in use.");
        });

        // Trovo il ruolo di default ("USER").
        Role ruoloFound = this.roleService.findByNameRole("USER");

        // Assegno il ruolo di default al nuovo utente.
        Set<Role> defaultRoles = new HashSet<>(Collections.singletonList(ruoloFound));
        // Inizializzo una collezione vuota per i Pokémon dell'utente.
        Set<UserPokemon> emptyCollection = new HashSet<>();

        // Creo la nuova istanza di User.
        User newUser = new User(
                payload.username(),
                payload.email(),
                bcrypt.encode(payload.password()),
                defaultRoles,
                emptyCollection
        );


        // Salvo il nuovo utente.
        User savedUser = this.userRepository.save(newUser);


        return savedUser;
    }

    //Aggiorna username ed email di un utente esistente.
    public User updateUser(Long userId, UserRegistrationDTO payload) {

        // Trovo l'utente da aggiornare.
        User userFound = this.findUserById(userId);

        // Controllo che la nuova email non sia in uso da un ALTRO utente.
        this.userRepository.findByEmail(payload.email()).ifPresent(otherUser -> {
            if (!otherUser.getIdUser().equals(userId)) {
                throw new BadRequestException("The e-mail " + payload.email() + " is already in use by another user.");
            }
        });

        // Controllo che il nuovo username non sia in uso da un ALTRO utente.
        this.userRepository.findByUsername(payload.username()).ifPresent(otherUser -> {
            if (!otherUser.getIdUser().equals(userId)) {
                throw new BadRequestException("The username " + payload.username() + " is already in use by another user.");
            }
        });

        // Aggiorno i campi.
        userFound.setUsername(payload.username());
        userFound.setEmail(payload.email());

        // Salvo l'utente aggiornato.
        return this.userRepository.save(userFound);
    }

    // Elimina un utente tramite il suo ID.
    public void deleteUser(Long userId) {

        // Trovo l'utente da eliminare.
        User userFound = this.findUserById(userId);

        // Eseguo l'eliminazione dal database.
        this.userRepository.delete(userFound);
    }

    //Aggiorna la password di un utente.
    public void updatePassword(Long userId, UserPasswordChangeDTO payload) {

        // Trovo l'utente.
        User userFound = this.findUserById(userId);

        // Verifico se la vecchia password fornita è corretta.
        if (!bcrypt.matches(payload.oldPassword(), userFound.getPassword())) {
            throw new UnauthorizedException("The current password is incorrect.");
        }

        // Impedisco che la nuova password sia uguale a quella vecchia.
        if (payload.oldPassword().equals(payload.newPassword())) {
            throw new BadRequestException("The new password cannot match the old password.");
        }

        // Codifico e imposto la nuova password.
        userFound.setPassword(bcrypt.encode(payload.newPassword()));

        // Salvo l'utente con la nuova password.
        userRepository.save(userFound);
    }
}
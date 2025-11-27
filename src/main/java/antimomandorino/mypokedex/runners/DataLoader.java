package antimomandorino.mypokedex.runners;

import antimomandorino.mypokedex.repositories.PokemonRepository;
import antimomandorino.mypokedex.services.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

@Component

public class DataLoader implements CommandLineRunner {

    @Autowired
    private RoleService roleService;
    @Autowired
    private TypeService typeService;
    @Autowired
    private AbilityService abilityService;
    @Autowired
    private PokemonService pokemonService;
    @Autowired
    private MoveService moveService;

    @Autowired
    private StatService statService;

    @Autowired
    private PokemonRepository pokemonRepository;

    @Autowired
    private UserService userService;

    @Override
    public void run(String... args) throws Exception {

        System.out.println("----- Avvio DataLoader Seeding Iniziale -----");

        System.out.println("1. Popolamento Ruoli...");
        roleService.findOrCreateRole("USER");
        roleService.findOrCreateRole("ADMIN");
        userService.seedAdminUser();

        System.out.println("2a. Popolamento Tipi...");
        typeService.importAllTypes();

        System.out.println("2b. Popolamento Abilità...");
        abilityService.importAllAbilities();

        System.out.println("2b. Popolamento Mosse...");
        moveService.importAllMoves();

        System.out.println("3. Popolamento Pokémon di Kanto (1-151)...");
        pokemonService.importKantoPokemon();


        System.out.println("----- Seeding Iniziale Completato con successo! -----");
    }


}

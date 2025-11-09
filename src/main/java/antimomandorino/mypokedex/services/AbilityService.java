package antimomandorino.mypokedex.services;

import antimomandorino.mypokedex.entities.Ability;
import antimomandorino.mypokedex.exceptions.BadRequestException;
import antimomandorino.mypokedex.exceptions.NotFoundException;
import antimomandorino.mypokedex.payloads.AbilityDTO;
import antimomandorino.mypokedex.pokeAPIPayloads.AbilityApiDetailDTO;
import antimomandorino.mypokedex.pokeAPIPayloads.ApiResource;
import antimomandorino.mypokedex.pokeAPIPayloads.PokeApiListResponse;
import antimomandorino.mypokedex.repositories.AbilityRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.List;

@Service
public class AbilityService {

    private static final String POKEAPI_BASE_URL = "https://pokeapi.co/api/v2/";

    @Autowired
    private AbilityRepository abilityRepository;

    @Autowired
    private RestTemplate restTemplate;


    //Trova un'Abilità tramite il suo ID.
    public Ability findAbilityById(Long idAbility) {
        // Cerco per ID o lancio un'eccezione NotFound.
        return abilityRepository.findById(idAbility)
                .orElseThrow(() -> new NotFoundException("Ability not found with ID " + idAbility));
    }

    //Restituisce una pagina di tutte le Abilità, con paginazione e ordinamento.
    public Page<Ability> findAllAbility(int pageNumber, int pageSize, String sortBy) {
        // Limito la dimensione massima della pagina.
        if (pageSize > 50) pageSize = 50;
        // Creo l'oggetto Pageable.
        Pageable pageable = PageRequest.of(pageNumber, pageSize, Sort.by(sortBy).ascending());
        // Eseguo la ricerca paginata.
        return this.abilityRepository.findAll(pageable);
    }

    //Trova un'Abilità tramite il suo nome.
    public Ability findByName(String name) {
        // Cerco per nome o lancio un'eccezione NotFound.
        return abilityRepository.findByName(name)
                .orElseThrow(() -> new NotFoundException("Ability not found with name " + name));
    }

    //Salva una nuova Abilità dopo aver verificato l'univocità del nome.
    public Ability saveAbility(AbilityDTO payload) {

        // Controllo l'univocità del nome.
        this.abilityRepository.findByName(payload.name()).ifPresent(ability -> {
            throw new BadRequestException("The ability " + ability.getName() + " is already in use.");
        });

        // Creo la nuova istanza di Ability.
        Ability newAbility = new Ability(
                payload.name(),
                payload.description()
        );

        // Salvo e restituisco.
        return abilityRepository.save(newAbility);
    }

    //Elimina un'Abilità tramite ID.
    public void deleteAbility(Long idAbility) {

        // Trovo l'Abilità da eliminare.
        Ability foundAbility = this.findAbilityById(idAbility);

        // Eseguo l'eliminazione.
        this.abilityRepository.delete(foundAbility);
    }

    //Metodo di supporto per estrarre la descrizione (Flavor Text) in inglese.
    private String extractEnglishFlavorText(List<AbilityApiDetailDTO.FlavorTextEntry> entries) {
        // Uso gli Stream API: filtro per lingua "en", prendo il primo, e estraggo il testo.
        return entries.stream()
                .filter(e -> "en".equals(e.language().name()))
                .findFirst() // Prende la prima che trova
                .map(AbilityApiDetailDTO.FlavorTextEntry::flavor_text)
                .orElse("The effect of this ability is unknown or currently not documented.");
    }

    //Importa tutte le Abilità esistenti da PokeAPI.
    public void importAllAbilities() {
        System.out.println("--- Avvio Seeding Abilità (Completo) ---");

        try {
            // Primo step: ottengo la lista completa delle abilità (limite alto a 400).
            String listUrl = POKEAPI_BASE_URL + "ability?limit=400";
            PokeApiListResponse listResponse = restTemplate.getForObject(listUrl, PokeApiListResponse.class);

            // Controllo la validità della risposta.
            if (listResponse == null || listResponse.results() == null) {
                System.err.println("Nessuna risposta valida da PokéAPI per la lista abilità.");
                return;
            }

            // Ciclo su ogni risorsa Abilità nella lista.
            for (ApiResource resource : listResponse.results()) {
                String abilityName = resource.name();

                // Salto se l'Abilità è già nel mio database.
                if (abilityRepository.findByName(abilityName).isEmpty()) {

                    // Secondo step: faccio la chiamata per i dettagli della singola Abilità.
                    AbilityApiDetailDTO detail = restTemplate.getForObject(resource.url(), AbilityApiDetailDTO.class);

                    if (detail == null) continue;

                    // Estraggo la descrizione in inglese.
                    String description = extractEnglishFlavorText(detail.flavor_text_entries());

                    // Creo e salvo la nuova Abilità.
                    Ability newAbility = new Ability(abilityName, description);

                    abilityRepository.save(newAbility);
                    System.out.println("Salvata Abilità: " + abilityName);
                }
            }

        } catch (Exception e) {
            System.err.println("Errore critico nel seeding delle Abilità: " + e.getMessage());
        }
        System.out.println("--- Seeding Abilità Completato ---");
    }
}
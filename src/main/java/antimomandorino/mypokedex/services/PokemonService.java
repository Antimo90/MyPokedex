package antimomandorino.mypokedex.services;

import antimomandorino.mypokedex.entities.Ability;
import antimomandorino.mypokedex.entities.Move;
import antimomandorino.mypokedex.entities.Pokemon;
import antimomandorino.mypokedex.entities.Type;
import antimomandorino.mypokedex.exceptions.NotFoundException;
import antimomandorino.mypokedex.payloads.StatDTO;
import antimomandorino.mypokedex.pokeAPIPayloads.PokemonApiDetailDTO;
import antimomandorino.mypokedex.pokeAPIPayloads.PokemonSpeciesApiDTO;
import antimomandorino.mypokedex.repositories.PokemonRepository;
import com.cloudinary.Cloudinary;
import com.cloudinary.utils.ObjectUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.stream.Collectors;


@Service
public class PokemonService {

    private static final String POKEAPI_BASE_URL = "https://pokeapi.co/api/v2/";

    @Autowired
    private PokemonRepository pokemonRepository;

    @Autowired
    private RestTemplate restTemplate;

    @Autowired
    private TypeService typeService;
    @Autowired
    private AbilityService abilityService;
    @Autowired
    private StatService statService;
    @Autowired
    private MoveService moveService;
    @Autowired
    private Cloudinary imageCloudinary;

    //Trova un Pokémon tramite il suo ID.
    public Pokemon findPokemonById(int idPokemon) {
        // Cerco per ID o lancio un'eccezione NotFound.
        return pokemonRepository.findById(idPokemon)
                .orElseThrow(() -> new NotFoundException("Pokemon not found with ID " + idPokemon));
    }

    //Restituisce una pagina di tutti i Pokémon, con paginazione e ordinamento.
    public Page<Pokemon> findAllPokemon(int pageNumber, int pageSize, String sortBy) {
        // Limite sulla dimensione della pagina.
        
        // Creo l'oggetto Pageable.
        Pageable pageable = PageRequest.of(pageNumber, pageSize, Sort.by(sortBy).ascending());
        // Restituisco la pagina.
        return this.pokemonRepository.findAll(pageable);
    }

    //Salva un oggetto Pokémon nel database.
    public Pokemon savePokemon(Pokemon pokemon) {

        return pokemonRepository.save(pokemon);
    }

    //Elimina un Pokémon tramite ID.
    public void deletePokemon(int idPokemon) {
        // Trovo il Pokémon da eliminare.
        Pokemon foundPokemon = this.findPokemonById(idPokemon);
        // Eseguo l'eliminazione.
        pokemonRepository.delete(foundPokemon);
    }

    //Metodo di supporto per estrarre la descrizione in inglese da una lista di entry.
    private String extractEnglishText(List<PokemonSpeciesApiDTO.FlavorTextEntry> entries) {
        // Uso gli Stream API: filtro per lingua "en", prendo il primo, mappo il testo (rimuovendo i caratteri di a capo)
        // e se non trovo nulla restituisco una descrizione di default.
        return entries.stream()
                .filter(e -> "en".equals(e.language().name()))
                .findFirst()
                .map(e -> e.flavor_text().replace('\n', ' '))
                .orElse("No description available.");
    }

    //Metodo di supporto per estrarre la Categoria di Specie in inglese.
    private String extractEnglishCategory(List<PokemonSpeciesApiDTO.GenusEntry> entries) {
        // Uso gli Stream API per trovare la categoria in inglese.
        return entries.stream()
                .filter(e -> "en".equals(e.language().name()))
                .findFirst()
                .map(PokemonSpeciesApiDTO.GenusEntry::genus)
                .orElse("Unknown Species Category");
    }

    //Importa tutti i Pokémon della prima generazione (Kanto) da PokeAPI.
    public void importKantoPokemon() {
        System.out.println("--- Avvio Importazione Pokémon di Kanto (1-151) ---");

        // Ciclo su tutti gli ID da 1 a 151.
        for (int id = 1; id <= 151; id++) {
            // Salto l'importazione se il Pokémon è già presente.
            if (pokemonRepository.existsById(id)) {
                System.out.println("Pokémon #" + id + " già esistente. Saltato.");
                continue;
            }
            try {

                // 1. CHIAMATA per i dettagli base del Pokémon (statistiche, tipi, abilità, mosse).
                String detailUrl = POKEAPI_BASE_URL + "pokemon/" + id;
                PokemonApiDetailDTO detail = restTemplate.getForObject(detailUrl, PokemonApiDetailDTO.class);

                if (detail == null) continue;

                // 2. CHIAMATA per i dettagli della Specie (descrizione, categoria).
                String speciesUrl = POKEAPI_BASE_URL + "pokemon-species/" + id;
                PokemonSpeciesApiDTO speciesDetail = restTemplate.getForObject(speciesUrl, PokemonSpeciesApiDTO.class);

                if (speciesDetail == null) continue;

                // Estrazione di dati testuali complessi (richiedono la gestione della lingua).
                String description = extractEnglishText(speciesDetail.flavor_text_entries());
                String speciesCategory = extractEnglishCategory(speciesDetail.genera());

                // Logica per estrarre il Tipo Primario e il Tipo Secondario.
                String type1Name = detail.types().stream().filter(t -> t.slot() == 1).findFirst().orElseThrow().type().name();
                // Il Tipo 2 potrebbe non esistere, quindi uso un Optional per gestirlo.
                String type2Name = detail.types().stream().filter(t -> t.slot() == 2).findFirst().map(t -> t.type().name()).orElse(null);

                // Cerco gli oggetti Entity Type nel nostro database usando i nomi ottenuti.
                Type type1 = typeService.findByName(type1Name);
                Type type2 = (type2Name != null) ? typeService.findByName(type2Name) : null;

                // Mappaggio delle Abilità: prendo la lista dall'API, la trasformo in un set di Entity Ability del nostro DB.
                Set<Ability> abilities = detail.abilities().stream()
                        .map(a -> abilityService.findByName(a.ability().name()))
                        .collect(Collectors.toSet());


                // Mappaggio delle Mosse: processo simile, ma gestisco l'errore se una mossa non è nel nostro DB.
                Set<Move> learnableMoves = detail.moves().stream()
                        .map(m -> m.move().name())
                        .map(moveName -> {
                            try {
                                return moveService.findByName(moveName);
                            } catch (NotFoundException e) {
                                System.err.println("Warning: Move '" + moveName + "' not found in DB for Pokemon ID. Skipping.");
                                return null;
                            }
                        })
                        // Filtro i risultati nulli (le mosse che ho saltato).
                        .filter(java.util.Objects::nonNull)
                        .collect(Collectors.toSet());


                // Creazione della nuova Entity Pokemon con tutti i dati.
                Pokemon newPokemon = new Pokemon(
                        detail.id(),
                        detail.name(),
                        detail.height(),
                        detail.weight(),
                        description,
                        speciesCategory,
                        null,
                        null,
                        type1,
                        type2,
                        abilities,
                        learnableMoves
                );
                // Salvo il Pokémon principale per ottenere l'ID per le relazioni.
                Pokemon savedPokemon = pokemonRepository.save(newPokemon);


                // Estrazione e preparazione dei dati per le Statistiche.
                StatDTO statPayload = new StatDTO(
                        // Estrazione del valore "base_stat" per ogni singola statistica tramite filtering sul nome.
                        detail.stats().stream().filter(s -> s.stat().name().equals("hp")).findFirst().orElseThrow().base_stat(),
                        detail.stats().stream().filter(s -> s.stat().name().equals("attack")).findFirst().orElseThrow().base_stat(),
                        detail.stats().stream().filter(s -> s.stat().name().equals("defense")).findFirst().orElseThrow().base_stat(),
                        detail.stats().stream().filter(s -> s.stat().name().equals("special-attack")).findFirst().orElseThrow().base_stat(),
                        detail.stats().stream().filter(s -> s.stat().name().equals("special-defense")).findFirst().orElseThrow().base_stat(),
                        detail.stats().stream().filter(s -> s.stat().name().equals("speed")).findFirst().orElseThrow().base_stat()
                );


                // Creo e salvo le statistiche usando il servizio dedicato.
                statService.createStat(statPayload, savedPokemon);

                System.out.println("Importato con successo: " + savedPokemon.getName());

            } catch (Exception e) {
                System.err.println("Errore nell'importazione di Pokemon ID " + id + ": " + e.getMessage());
            }
        }
        System.out.println("--- Importazione Kanto Completata ---");
    }

    //metodo per modificare gli sprite
    public Pokemon updateSpriteUrls(int idPokemon, MultipartFile spriteFile, MultipartFile spriteShinyFile) {
        Pokemon found = this.findPokemonById(idPokemon);
        try {
            if (spriteFile != null && !spriteFile.isEmpty()) {
                Map result = imageCloudinary.uploader().upload(spriteFile.getBytes(), ObjectUtils.emptyMap());
                String imageUrl = (String) result.get("url");
                found.setSpriteUrl(imageUrl);
            }
            if (spriteShinyFile != null && !spriteShinyFile.isEmpty()) {
                Map resultShiny = imageCloudinary.uploader().upload(spriteShinyFile.getBytes(), ObjectUtils.emptyMap());
                String imageShinyUrl = (String) resultShiny.get("url");
                found.setSpriteShinyUrl(imageShinyUrl);
            }


            return pokemonRepository.save(found);
        } catch (IOException e) {
            throw new RuntimeException(e);
        } catch (Exception e) {
            // Cattura altre eccezioni di Cloudinary
            throw new RuntimeException("Errore di Cloudinary durante l'upload: " + e.getMessage());
        }


    }
}
package antimomandorino.mypokedex.services;

import antimomandorino.mypokedex.entities.Type;
import antimomandorino.mypokedex.exceptions.BadRequestException;
import antimomandorino.mypokedex.exceptions.NotFoundException;
import antimomandorino.mypokedex.payloads.TypeDTO;
import antimomandorino.mypokedex.pokeAPIPayloads.ApiResource;
import antimomandorino.mypokedex.pokeAPIPayloads.PokeApiListResponse;
import antimomandorino.mypokedex.repositories.TypeRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.List;

@Service
public class TypeService {

    private static final String POKEAPI_BASE_URL = "https://pokeapi.co/api/v2/";

    @Autowired
    private TypeRepository typeRepository;

    @Autowired
    private RestTemplate restTemplate;

    //Trova un Tipo tramite il suo ID.
    public Type findTypeById(Long idType) {
        // Cerco per ID o lancio un'eccezione NotFoundException.
        return typeRepository.findById(idType)
                .orElseThrow(() -> new NotFoundException("Type not found with ID " + idType));
    }

    //  Restituisce la lista di tutti i Tipi salvati nel database.
    public List<Type> findAllTypes() {
        return typeRepository.findAll();
    }

    // Trova un Tipo tramite il suo nome.
    public Type findByName(String name) {
        // Cerco per nome o lancio un'eccezione NotFoundException.
        return this.typeRepository.findByName(name).orElseThrow(() ->
                new NotFoundException("Type with name " + name + " not found!"));
    }

    //Crea e salva un nuovo Tipo.
    public Type createType(TypeDTO payload) {

        // Controllo se un Tipo con lo stesso nome esiste già.
        this.typeRepository.findByName(payload.name()).ifPresent(type -> {
            throw new BadRequestException("The type " + type.getName() + " is already in use.");
        });

        // Creo la nuova istanza di Type usando i dati del payload.
        Type newType = new Type(payload.name(), payload.colorHex());

        // Salvo e restituisco il nuovo Tipo.
        return typeRepository.save(newType);
    }

    //Aggiorna un Tipo esistente.
    public Type updateType(Long idType, TypeDTO payload) {

        // Trovo il Tipo da aggiornare.
        Type typeFound = this.findTypeById(idType);

        // Controllo che il nuovo nome non sia in uso da un ALTRO Tipo.
        this.typeRepository.findByName(payload.name()).ifPresent(otherType -> {
            if (!otherType.getIdType().equals(idType)) {
                throw new BadRequestException("The type " + payload.name() + " is already in use by another ID.");
            }
        });

        // Aggiorno i campi.
        typeFound.setName(payload.name());
        typeFound.setColorHex(payload.colorHex());

        // Salvo e restituisco il Tipo aggiornato.
        return typeRepository.save(typeFound);
    }

    //Elimina un Tipo tramite ID.
    public void deleteType(Long idType) {

        // Trovo il Tipo da eliminare.
        Type typeToDelete = this.findTypeById(idType);

        // Eseguo l'eliminazione.
        this.typeRepository.delete(typeToDelete);

    }

    //Importa tutti i Tipi disponibili da PokeAPI e li salva nel database locale.
    public void importAllTypes() {
        System.out.println("--- Avvio Seeding Tipi ---");

        try {

            // Costruisco l'URL per ottenere la lista dei Tipi (limite a 20 per prenderli tutti).
            String listUrl = POKEAPI_BASE_URL + "type?limit=20";
            // Eseguo la chiamata GET e mappo la risposta a PokeApiListResponse.
            PokeApiListResponse listResponse = restTemplate.getForObject(listUrl, PokeApiListResponse.class);

            // Controllo che la risposta sia valida.
            if (listResponse == null || listResponse.results() == null) {
                System.err.println("Nessuna risposta valida da PokéAPI per i tipi.");
                return;
            }

            // Itero su ogni risorsa Tipo ottenuta.
            for (ApiResource resource : listResponse.results()) {
                String typeName = resource.name();

                // Salto i tipi "shadow" e "unknown" che non sono Tipi giocabili standard.
                if (typeName.equalsIgnoreCase("shadow") || typeName.equalsIgnoreCase("unknown")) {
                    continue;
                }

                // Salvo il Tipo solo se non è già presente nel mio database.
                if (typeRepository.findByName(typeName).isEmpty()) {

                    // Crea il DTO per il salvataggio
                    TypeDTO payload = new TypeDTO(
                            null,
                            typeName,
                            // Ottengo l'esadecimale del colore chiamando un metodo privato.
                            getHexColorForType(typeName)
                    );


                    // Chiamo il metodo per la creazione e il salvataggio.
                    this.createType(payload);
                    System.out.println("Salvato Tipo: " + typeName);
                }
            }

        } catch (Exception e) {
            System.err.println("Errore critico nel seeding dei Tipi: " + e.getMessage());
        }
        System.out.println("--- Seeding Tipi Completato ---");
    }

    //Metodo privato per mappare il nome del Tipo al suo codice colore esadecimale.
    private String getHexColorForType(String typeName) {
        // Uso un'espressione switch moderna per la mappatura.
        return switch (typeName.toLowerCase()) {
            case "normal" -> "#A8A77A";
            case "fire" -> "#EE8130";
            case "water" -> "#6390F0";
            case "grass" -> "#7AC74C";
            case "electric" -> "#F7D02C";
            case "ice" -> "#96D9D6";
            case "fighting" -> "#C22E28";
            case "poison" -> "#A33EA1";
            case "ground" -> "#E2BF65";
            case "flying" -> "#A98FF3";
            case "psychic" -> "#F95587";
            case "bug" -> "#A6B91A";
            case "rock" -> "#B6A136";
            case "ghost" -> "#735797";
            case "dragon" -> "#6F35FC";
            case "steel" -> "#B7B7CE";
            case "dark" -> "#705746";
            case "fairy" -> "#DDA0DD";
            default -> "#888888";
        };
    }
}
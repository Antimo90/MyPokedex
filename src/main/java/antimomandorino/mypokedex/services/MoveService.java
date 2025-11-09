package antimomandorino.mypokedex.services;

import antimomandorino.mypokedex.entities.Move;
import antimomandorino.mypokedex.entities.Type;
import antimomandorino.mypokedex.exceptions.BadRequestException;
import antimomandorino.mypokedex.exceptions.NotFoundException;
import antimomandorino.mypokedex.payloads.MoveDTO;
import antimomandorino.mypokedex.pokeAPIPayloads.ApiResource;
import antimomandorino.mypokedex.pokeAPIPayloads.GenerationDetails;
import antimomandorino.mypokedex.pokeAPIPayloads.MoveApiDetailDTO;
import antimomandorino.mypokedex.repositories.MoveRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.List;

@Service
public class MoveService {

    private static final String POKEAPI_BASE_URL = "https://pokeapi.co/api/v2/";

    @Autowired
    private MoveRepository moveRepository;

    @Autowired
    private RestTemplate restTemplate;

    @Autowired
    private TypeService typeService;

    //Trova una Mossa tramite il suo ID.
    public Move findMoveById(int idMove) {
        // Cerco per ID o lancio un'eccezione NotFound.
        return moveRepository.findById(idMove)
                .orElseThrow(() -> new NotFoundException("Move not found with ID " + idMove));
    }

    //Restituisce una pagina di tutte le Mosse, con paginazione e ordinamento.
    public Page<Move> findAllMoves(int pageNumber, int pageSize, String sortBy) {
        // Limito la dimensione massima della pagina.
        if (pageSize > 50) pageSize = 50;
        // Creo l'oggetto Pageable.
        Pageable pageable = PageRequest.of(pageNumber, pageSize, Sort.by(sortBy).ascending());
        // Eseguo la ricerca paginata.
        return this.moveRepository.findAll(pageable);
    }

    //Crea e salva una nuova Mossa.
    public Move createMove(MoveDTO payload) {
        // Controllo l'univocità del nome.
        this.moveRepository.findByName(payload.name()).ifPresent(move -> {
            throw new BadRequestException("The move " + move.getName() + " is already in use.");
        });

        // Trovo l'oggetto Entity Type associato alla Mossa.
        Type typeFound = typeService.findByName(payload.typeName());

        // Creo la nuova istanza di Move.
        Move newMove = new Move(
                payload.idMove(),
                payload.name(),
                payload.description(),
                payload.power(),
                payload.accuracy(),
                typeFound // Associo l'Entity Type
        );

        // Salvo e restituisco.
        return this.moveRepository.save(newMove);
    }

    //Aggiorna una Mossa esistente.
    public Move updateMove(int moveId, MoveDTO payload) {

        // Trovo la Mossa da aggiornare.
        Move moveFound = this.findMoveById(moveId);

        // Controllo se il nuovo nome è in uso da un'ALTRA Mossa.
        this.moveRepository.findByName(payload.name()).ifPresent(otherMove -> {

            if (otherMove.getIdMove() != moveId) {
                throw new BadRequestException("The move " + otherMove.getName() + " is already in use by another ID.");
            }
        });

        // Trovo l'oggetto Entity Type aggiornato.
        Type typeFound = typeService.findByName(payload.typeName());

        // Aggiorno i campi.
        moveFound.setName(payload.name());
        moveFound.setDescription(payload.description());
        moveFound.setPower(payload.power());
        moveFound.setAccuracy(payload.accuracy());
        moveFound.setType(typeFound);

        // Salvo e restituisco.
        return moveRepository.save(moveFound);
    }

    //Elimina una Mossa tramite ID.
    public void deleteMove(int idMove) {
        // Trovo ed elimino la Mossa.
        Move foundMove = this.findMoveById(idMove);
        this.moveRepository.delete(foundMove);
    }

    //Trova una Mossa tramite nome.
    public Move findByName(String name) {
        // Cerco per nome o lancio un'eccezione NotFound.
        return moveRepository.findByName(name)
                .orElseThrow(() -> new NotFoundException("Ability not found with name " + name));
    }

    //Metodo di supporto per estrarre l'effetto della Mossa in inglese.
    private String extractEnglishEffect(List<MoveApiDetailDTO.EffectEntry> entries) {
        // Uso Stream API per trovare l'effetto in lingua "en".
        return entries.stream()
                .filter(e -> "en".equals(e.language().name()))
                .findFirst()
                .map(e -> e.effect())
                .orElse("A standard attack with no special effect or power defined.");
    }

    //Importa tutte le Mosse della Prima Generazione (Kanto) da PokeAPI.
    public void importAllMoves() {
        System.out.println("--- Avvio Seeding Mosse ---");

        try {
            // Faccio la prima chiamata per ottenere la lista di tutte le Mosse della Generazione 1.
            String genUrl = POKEAPI_BASE_URL + "generation/1";

            GenerationDetails genDetails = restTemplate.getForObject(genUrl, GenerationDetails.class);

            // Controllo la validità della risposta.
            if (genDetails == null || genDetails.moves() == null) {
                System.err.println("Nessuna risposta valida da PokéAPI per le mosse della Gen I.");
                return;
            }

            // Ciclo sulla lista delle mosse ottenute.
            for (ApiResource resource : genDetails.moves()) {
                String moveName = resource.name();

                // Salto la mossa "hidden-power" (complessa da gestire) e quelle già esistenti nel DB.
                if (moveName.equals("hidden-power") || moveRepository.findByName(moveName).isPresent()) {
                    continue;
                }

                try {

                    // Eseguo la seconda chiamata per i dettagli di ogni singola Mossa.
                    MoveApiDetailDTO detail = restTemplate.getForObject(resource.url(), MoveApiDetailDTO.class);
                    if (detail == null) continue;

                    // Logica di Estrazione ID dalla URL (necessaria perché l'API non fornisce l'ID nella lista) ---
                    String url = resource.url();
                    if (url.endsWith("/")) {
                        url = url.substring(0, url.length() - 1);
                    }

                    int lastSlashIndex = url.lastIndexOf('/');

                    String idString = url.substring(lastSlashIndex + 1);

                    // Validazione dell'ID.
                    if (idString.isEmpty() || !idString.matches("\\d+")) {
                        System.err.println("Skipping move due to invalid ID format: " + resource.url());
                        continue;
                    }

                    int idMove = Integer.parseInt(idString);
                    // -------------------------------------------------------------------------------------------------

                    // Trovo l'Entity Type nel nostro DB, usando il servizio TypeService.
                    Type moveType = typeService.findByName(detail.type().name());

                    // Estraggo la descrizione in inglese.
                    String description = extractEnglishEffect(detail.effect_entries());

                    // Creo la nuova istanza di Move, gestendo i valori nulli (power, accuracy) con 0.
                    Move newMove = new Move(
                            idMove,
                            moveName,
                            description,
                            detail.power() != null ? detail.power() : 0,
                            detail.accuracy() != null ? detail.accuracy() : 0,
                            moveType
                    );

                    // Salvo la Mossa.
                    moveRepository.save(newMove);
                    System.out.println("Salvata Mossa: " + moveName);

                } catch (NotFoundException e) {
                    // Gestione di un errore specifico (es. Tipo non trovato nel nostro DB).
                    System.err.println("Skipping move '" + moveName + "' because type '" + e.getMessage() + "' was not found.");
                } catch (Exception e) {
                    // Gestione di altri errori generici durante l'importazione.
                    System.err.println("Errore durante l'importazione della mossa '" + moveName + "': " + e.getMessage());
                }
            }

        } catch (Exception e) {
            System.err.println("Errore critico nel seeding delle Mosse: " + e.getMessage());
            e.printStackTrace();
        }
        System.out.println("--- Seeding Mosse Completato ---");
    }
}
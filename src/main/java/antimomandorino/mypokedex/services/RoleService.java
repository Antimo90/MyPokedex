package antimomandorino.mypokedex.services;

import antimomandorino.mypokedex.entities.Role;
import antimomandorino.mypokedex.exceptions.BadRequestException;
import antimomandorino.mypokedex.exceptions.NotFoundException;
import antimomandorino.mypokedex.payloads.RoleDTO;
import antimomandorino.mypokedex.repositories.RoleRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class RoleService {

    @Autowired
    private RoleRepository roleRepository;

    //Salva un nuovo Ruolo dopo aver verificato l'univocità del nome.
    public Role saveRole(RoleDTO payload) {
        // Controllo se il nome del ruolo è già in uso.
        this.roleRepository.findByRoleName(payload.roleName()).ifPresent(ruolo -> {
            throw new BadRequestException("il ruolo " + ruolo.getRoleName() + " è gia in uso.");
        });

        // Creo la nuova istanza di Role e imposto il nome.
        Role newRole = new Role();
        newRole.setRoleName(payload.roleName());

        // Salvo e restituisco il nuovo Ruolo.
        return this.roleRepository.save(newRole);
    }

    //Trova un Ruolo tramite ID.
    public Role findByIdRole(Long id) {
        // Cerco per ID o lancio un'eccezione NotFoundException.
        return roleRepository.findById(id).orElseThrow(() ->
                new NotFoundException("Role with id " + id + " not found!"));
    }

    //Aggiorna il nome di un Ruolo esistente.
    public Role updateRole(Long id, RoleDTO payload) {
        // Trovo il Ruolo da aggiornare.
        Role found = this.findByIdRole(id);

        // Aggiorno il nome.
        found.setRoleName(payload.roleName());

        // Salvo e restituisco l'oggetto aggiornato.
        return this.roleRepository.save(found);
    }

    //Elimina un Ruolo tramite ID.
    public void deleteRole(Long id) {
        // Trovo il Ruolo da eliminare.
        Role ruolo = this.findByIdRole(id);
        // Eseguo l'eliminazione.
        this.roleRepository.delete(ruolo);
    }

    //Trova un Ruolo tramite il suo nome.
    public Role findByNameRole(String roleName) {
        // Cerco per nome o lancio un'eccezione NotFoundException.
        return this.roleRepository.findByRoleName(roleName).orElseThrow(() ->
                new NotFoundException("Role with name " + roleName + " not found!"));
    }

    //Trova un Ruolo per nome; se non esiste, lo crea e lo salva.
    public Role findOrCreateRole(String roleName) {


        // Provo a trovare il Ruolo per nome.
        return this.roleRepository.findByRoleName(roleName)
                // Se il Ruolo non è presente (orElse), eseguo il codice dentro orElseGet per crearlo.
                .orElseGet(() -> {
                    Role newRole = new Role();
                    newRole.setRoleName(roleName);
                    System.out.println("Creato Ruolo: " + roleName);
                    // Salvo e restituisco il nuovo Ruolo creato.
                    return this.roleRepository.save(newRole);
                });
    }
}
package antimomandorino.mypokedex.entities;

import jakarta.persistence.*;
import lombok.NoArgsConstructor;

import java.util.Set;

@Entity
@Table(name = "abilities")
@NoArgsConstructor
public class Ability {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_ability")
    private Long idAbility;

    private String name;

    @Lob
    private String description;

    @ManyToMany(mappedBy = "abilities", fetch = FetchType.LAZY)
    private Set<Pokemon> pokemons;

    public Ability(String name, String description) {
        this.name = name;
        this.description = description;
    }

    public Long getIdAbility() {
        return idAbility;
    }


    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public Set<Pokemon> getPokemons() {
        return pokemons;
    }

    public void setPokemons(Set<Pokemon> pokemons) {
        this.pokemons = pokemons;
    }

    @Override
    public String toString() {
        return "Ability{" +
                "idAbility=" + idAbility +
                ", name='" + name + '\'' +
                ", description='" + description + '\'' +
                '}';
    }
}

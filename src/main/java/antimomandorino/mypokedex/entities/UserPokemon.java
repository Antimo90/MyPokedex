package antimomandorino.mypokedex.entities;

import jakarta.persistence.*;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "user_pokemon_collection")
@NoArgsConstructor
public class UserPokemon {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "id_user")
    private User user;

    @ManyToOne
    @JoinColumn(name = "id_pokemon")
    private Pokemon pokemon;

    @Column(name = "is_shiny")
    private Boolean isShiny;

    public UserPokemon(User user, Pokemon pokemon, Boolean isShiny) {
        this.user = user;
        this.pokemon = pokemon;
        this.isShiny = isShiny;
    }

    public Long getId() {
        return id;
    }

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }

    public Pokemon getPokemon() {
        return pokemon;
    }

    public void setPokemon(Pokemon pokemon) {
        this.pokemon = pokemon;
    }

    public Boolean getShiny() {
        return isShiny;
    }

    public void setShiny(Boolean shiny) {
        isShiny = shiny;
    }

    @Override
    public String toString() {
        return "UserPokemon{" +
                "id=" + id +
                ", isShiny=" + isShiny +
                '}';
    }
}

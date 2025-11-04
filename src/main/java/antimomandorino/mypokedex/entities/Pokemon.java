package antimomandorino.mypokedex.entities;

import jakarta.persistence.*;
import lombok.NoArgsConstructor;

import java.util.Set;

@Entity
@Table(name = "pokemon")
@NoArgsConstructor
public class Pokemon {

    @Id

    @Column(name = "id_pokemon")
    private int idPokemon;
    private String name;
    private int height;
    private int weight;

    @Lob
    private String description;
    @Column(name = "species_category")
    private String speciesCategory;


    @Column(name = "sprite_url")
    private String spriteUrl;

    @Column(name = "sprite_shiny_url", nullable = true)
    private String spriteShinyUrl;


    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_type1")
    private Type type1;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_type2", nullable = true)
    private Type type2;

    @OneToOne(mappedBy = "pokemon", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.LAZY)
    private Stat stats;

    @ManyToMany(fetch = FetchType.LAZY)
    @JoinTable(
            name = "pokemon_abilities",
            joinColumns = @JoinColumn(name = "id_pokemon"),
            inverseJoinColumns = @JoinColumn(name = "ability_id")
    )
    private Set<Ability> abilities;

    @OneToMany(mappedBy = "pokemon", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.LAZY)
    private Set<UserPokemon> userCollections;

    public Pokemon(String name, int height, int weight, String description, String speciesCategory, String spriteUrl, String spriteShinyUrl, Type type1, Type type2, Stat stats, Set<Ability> abilities, Set<UserPokemon> userCollections) {
        this.name = name;
        this.height = height;
        this.weight = weight;
        this.description = description;
        this.speciesCategory = speciesCategory;
        this.spriteUrl = spriteUrl;
        this.spriteShinyUrl = spriteShinyUrl;
        this.type1 = type1;
        this.type2 = type2;
        this.stats = stats;
        this.abilities = abilities;
        this.userCollections = userCollections;
    }

    public int getIdPokemon() {
        return idPokemon;
    }


    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public int getHeight() {
        return height;
    }

    public void setHeight(int height) {
        this.height = height;
    }

    public int getWeight() {
        return weight;
    }

    public void setWeight(int weight) {
        this.weight = weight;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getSpeciesCategory() {
        return speciesCategory;
    }

    public void setSpeciesCategory(String speciesCategory) {
        this.speciesCategory = speciesCategory;
    }

    public Type getType1() {
        return type1;
    }

    public void setType1(Type type1) {
        this.type1 = type1;
    }

    public Type getType2() {
        return type2;
    }

    public void setType2(Type type2) {
        this.type2 = type2;
    }

    public String getSpriteUrl() {
        return spriteUrl;
    }

    public void setSpriteUrl(String spriteUrl) {
        this.spriteUrl = spriteUrl;
    }

    public String getSpriteShinyUrl() {
        return spriteShinyUrl;
    }

    public void setSpriteShinyUrl(String spriteShinyUrl) {
        this.spriteShinyUrl = spriteShinyUrl;
    }

    public Stat getStats() {
        return stats;
    }

    public void setStats(Stat stats) {
        this.stats = stats;
    }

    public Set<Ability> getAbilities() {
        return abilities;
    }

    public void setAbilities(Set<Ability> abilities) {
        this.abilities = abilities;
    }

    public Set<UserPokemon> getUserCollections() {
        return userCollections;
    }

    public void setUserCollections(Set<UserPokemon> userCollections) {
        this.userCollections = userCollections;
    }

    @Override
    public String toString() {
        return "Pokemon{" +
                "idPokemon=" + idPokemon +
                ", name='" + name + '\'' +
                ", height=" + height +
                ", weight=" + weight +
                ", description='" + description + '\'' +
                ", speciesCategory='" + speciesCategory + '\'' +
                ", spriteUrl='" + spriteUrl + '\'' +
                ", spriteShinyUrl='" + spriteShinyUrl + '\'' +
                '}';
    }
}
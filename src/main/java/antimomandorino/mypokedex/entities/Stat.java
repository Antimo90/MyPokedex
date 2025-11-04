package antimomandorino.mypokedex.entities;

import jakarta.persistence.*;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "stats")
@NoArgsConstructor
public class Stat {

    @Id
    @Column(name = "id_pokemon")
    private int idPokemon;

    private int hp;
    private int attack;
    private int defense;
    @Column(name = "special_attack")
    private int specialAttack;
    @Column(name = "special_defense")
    private int specialDefense;
    private int speed;

    @Column(name = "total_stats")
    private int totalStats;

    @OneToOne(fetch = FetchType.LAZY)
    @MapsId // serve per usare lo stesso id di pokemon
    @JoinColumn(name = "id_pokemon")
    private Pokemon pokemon;

    public Stat(int hp, int attack, int defense, int specialAttack, int specialDefense, int speed, int totalStats) {
        this.hp = hp;
        this.attack = attack;
        this.defense = defense;
        this.specialAttack = specialAttack;
        this.specialDefense = specialDefense;
        this.speed = speed;
        this.totalStats = totalStats;
    }

    public int getIdPokemon() {
        return idPokemon;
    }

    public int getHp() {
        return hp;
    }

    public void setHp(int hp) {
        this.hp = hp;
    }

    public int getAttack() {
        return attack;
    }

    public void setAttack(int attack) {
        this.attack = attack;
    }

    public int getDefense() {
        return defense;
    }

    public void setDefense(int defense) {
        this.defense = defense;
    }

    public int getSpecialAttack() {
        return specialAttack;
    }

    public void setSpecialAttack(int specialAttack) {
        this.specialAttack = specialAttack;
    }

    public int getSpecialDefense() {
        return specialDefense;
    }

    public void setSpecialDefense(int specialDefense) {
        this.specialDefense = specialDefense;
    }

    public int getSpeed() {
        return speed;
    }

    public void setSpeed(int speed) {
        this.speed = speed;
    }

    public int getTotalStats() {
        return totalStats;
    }

    public void setTotalStats(int totalStats) {
        this.totalStats = totalStats;
    }


    @Override
    public String toString() {
        return "Stat{" +
                "idStat=" + idPokemon +
                ", hp=" + hp +
                ", attack=" + attack +
                ", defense=" + defense +
                ", specialAttack=" + specialAttack +
                ", specialDefense=" + specialDefense +
                ", speed=" + speed +
                ", totalStats=" + totalStats +
                '}';
    }
}

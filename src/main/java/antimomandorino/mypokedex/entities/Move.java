package antimomandorino.mypokedex.entities;

import jakarta.persistence.*;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "moves")
@NoArgsConstructor
public class Move {

    @Id
    @Column(name = "id_move")
    private int idMove;
    private String name;
    @Lob
    private String description;
    private int power;
    private int accuracy;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_type")
    private Type type;


    public Move(int idMove, String name, String description, int power, int accuracy, Type type) {
        this.idMove = idMove;
        this.name = name;
        this.description = description;
        this.power = power;
        this.accuracy = accuracy;
        this.type = type;
    }

    public int getIdMove() {
        return idMove;
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

    public int getPower() {
        return power;
    }

    public void setPower(int power) {
        this.power = power;
    }

    public int getAccuracy() {
        return accuracy;
    }

    public void setAccuracy(int accuracy) {
        this.accuracy = accuracy;
    }

    public Type getType() {
        return type;
    }

    public void setType(Type type) {
        this.type = type;
    }

    @Override
    public String toString() {
        return "Move{" +
                "idMove=" + idMove +
                ", name='" + name + '\'' +
                ", description='" + description + '\'' +
                ", power=" + power +
                ", accuracy=" + accuracy +
                '}';
    }
}

package antimomandorino.mypokedex.exceptions;

public class NotFoundException extends RuntimeException {

    public NotFoundException(Long id) {
        super("The record with id " + String.valueOf(id) + " was not found!");
    }

    public NotFoundException(String msg) {
        super(msg);
    }
}

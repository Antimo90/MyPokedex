package antimomandorino.mypokedex.exceptions;

import lombok.Getter;

import java.util.List;

@Getter
public class ValidationException extends RuntimeException {
    private List<String> errorsMessages;

    public ValidationException(List<String> errorsMessages) {
        super("There were validation errors");
        this.errorsMessages = errorsMessages;
    }
}
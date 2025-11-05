package antimomandorino.mypokedex.services;

import antimomandorino.mypokedex.entities.User;
import antimomandorino.mypokedex.exceptions.NotFoundException;
import antimomandorino.mypokedex.repositories.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;

    public User findUserById(Long idUser) {
        return this.userRepository.findById(idUser)
                .orElseThrow(() -> new NotFoundException("User not found with ID " + idUser));
    }
}

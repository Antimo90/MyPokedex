package antimomandorino.mypokedex.services;

import antimomandorino.mypokedex.repositories.UserPokemonRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class UserPokemonService {

    @Autowired
    private UserPokemonRepository userPokemonRepository;
    
}

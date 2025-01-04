package id.tu.service.domain.repository;


import id.tu.service.domain.model.token.Token;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface TokenRepository extends JpaRepository<Token, Long> {
    // Additional custom queries can be added here if needed
    // Find all tokens by Genco ID
    List<Token> findAllByGencoId(Long gencoId);

    // Delete all tokens by Genco ID
    void deleteAllByGencoId(Long gencoId);
}

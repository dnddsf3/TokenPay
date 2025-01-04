package id.tu.service.domain.repository;

import id.tu.service.domain.model.payment.Payment;
import id.tu.service.domain.model.token.Token;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PaymentRepository extends JpaRepository<Payment, Long> {
    // Additional custom queries can be added here if needed
    List<Payment> findAllByTokenId(Long tokenId);

    // Delete all tokens by Genco ID
    void deleteAllByTokenId(Long tokenId);

    List<Payment> findByUserId(Long userId);
}

package id.tu.service.domain.init;

import id.tu.service.domain.model.genco.Genco;
import id.tu.service.domain.model.token.Token;
import id.tu.service.domain.model.token.TokenStatus;
import id.tu.service.domain.model.token.TokenType;
import id.tu.service.domain.repository.GencoRepository;
import id.tu.service.domain.repository.TokenRepository;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.core.annotation.Order;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;
import java.util.Optional;

@Component
@Order(5)
@Slf4j
public class TokenDataInitializer implements CommandLineRunner {

    private final TokenRepository tokenRepository;
    private final GencoRepository gencoRepository;

    @Autowired
    public TokenDataInitializer(TokenRepository tokenRepository, GencoRepository gencoRepository) {
        this.tokenRepository = tokenRepository;
        this.gencoRepository = gencoRepository;
    }

    @Override
    public void run(String... args) {
        if (tokenRepository.count() == 0) {
            Optional<Genco> genco = gencoRepository.findById(1L);

            if (genco.isPresent()) {
                log.info("Initializing 100 tokens for Genco: {}", genco.get().getName());
                for (int i = 1; i <= 6; i++) {
                    Token token = new Token();
                    token.setTokenCode("TOKEN-" + i);
                    token.setAmount(25000.0 * i); // Varying amounts
                    token.setAmountEconomic(token.getAmount() * 1.03);
                    token.setUnitsPurchased(20.0 * i); // Varying units
                    token.setGenco(genco.get());
                    token.setExpiresAt(LocalDateTime.now().plusDays(i % 30 + 1)); // Varying expiration dates
                    token.setTokenStatus(i % 2 == 0 ? TokenStatus.ACTIVE : TokenStatus.INACTIVE); // Alternating statuses
                    token.setTokenType(i % 3 == 0 ? TokenType.PRIVATE : TokenType.PUBLIC); // Alternating types
                    tokenRepository.save(token);
                }
                log.info("100 tokens initialized successfully!");
            } else {
                log.warn("Genco data not found. Skipping Token initialization.");
            }
        } else {
            log.info("Token data already exists. Skipping initialization.");
        }
    }
}

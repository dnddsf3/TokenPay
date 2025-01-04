package id.tu.service.domain.dto.token;

import id.tu.service.domain.dto.genco.GencoResponseDTO;
import id.tu.service.domain.model.token.TokenStatus;
import id.tu.service.domain.model.token.TokenType;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter
public class TokenResponseDTO {
    private Long id;
    private String tokenCode;
    private Double amount;
    private Double amountEconomic;
    private Double unitsPurchased;
    private GencoResponseDTO genco;
    private LocalDateTime createdAt;
    private LocalDateTime expiresAt;
    private TokenStatus tokenStatus;
    private TokenType tokenType;
}

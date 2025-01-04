package id.tu.service.domain.dto.token;

import id.tu.service.domain.model.token.TokenStatus;
import id.tu.service.domain.model.token.TokenType;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter
public class TokenRequestCreateDTO {

    private String tokenCode; // UUID


    private Double amount; // Price

    private Double amountEconomic;


    private Double unitsPurchased; // kWh

    private Long gencoId; // Genco reference, nullable


    private LocalDateTime expiresAt; // Expiry date


    private TokenStatus tokenStatus; // Enum for status


    private TokenType tokenType; // Enum for type
}

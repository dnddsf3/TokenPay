package id.tu.service.domain.dto.token;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class TokenResponseSimpleDTO {
    private Long id;
    private String tokenCode;
    private Double amount;
    private Double amountEconomic;
}

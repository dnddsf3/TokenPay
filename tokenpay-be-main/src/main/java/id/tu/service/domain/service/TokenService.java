package id.tu.service.domain.service;

import id.tu.service.domain.dto.token.TokenRequestCreateDTO;
import id.tu.service.domain.dto.token.TokenRequestUpdateDTO;
import id.tu.service.domain.dto.token.TokenResponseDTO;
import id.tu.service.domain.dto.token.TokenResponseSimpleDTO;
import id.tu.service.domain.model.token.Token;

import java.util.List;

public interface TokenService {
    TokenResponseDTO createToken(TokenRequestCreateDTO createDTO);

    TokenResponseDTO updateToken(Long id, TokenRequestUpdateDTO updateDTO);

    void deleteToken(Long id);

    TokenResponseDTO getTokenById(Long id);

    List<TokenResponseDTO> getAllTokens();
}

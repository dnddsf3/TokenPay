package id.tu.service.domain.service.impl;

import id.tu.service.domain.dto.token.TokenRequestCreateDTO;
import id.tu.service.domain.dto.token.TokenRequestUpdateDTO;
import id.tu.service.domain.dto.token.TokenResponseDTO;
import id.tu.service.domain.dto.token.TokenResponseSimpleDTO;
import id.tu.service.domain.mapper.TokenMapper;
import id.tu.service.domain.model.token.Token;

import id.tu.service.domain.repository.GencoRepository;
import id.tu.service.domain.repository.TokenRepository;
import id.tu.service.domain.service.TokenService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class TokenServiceImpl implements TokenService {

    private final TokenRepository tokenRepository;
    private final GencoRepository gencoRepository;
    private final TokenMapper tokenMapper;

    @Override
    public TokenResponseDTO createToken(TokenRequestCreateDTO createDTO) {
        Token token = tokenMapper.toEntity(createDTO);
        token.setGenco(gencoRepository.findById(createDTO.getGencoId())
                .orElseThrow(() -> new RuntimeException("Genco not found")));
        tokenRepository.save(token);
        return tokenMapper.toResponseDTO(token);
    }

    @Override
    public TokenResponseDTO updateToken(Long id, TokenRequestUpdateDTO updateDTO) {
        // Find the existing token
        Token token = tokenRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Token not found"));

        // Map fields from updateDTO to token manually
        if (updateDTO.getTokenCode() != null) {
            token.setTokenCode(updateDTO.getTokenCode());
        }
        if (updateDTO.getAmount() != null) {
            token.setAmount(updateDTO.getAmount());
        }
        if (updateDTO.getUnitsPurchased() != null) {
            token.setUnitsPurchased(updateDTO.getUnitsPurchased());
        }
        if (updateDTO.getExpiresAt() != null) {
            token.setExpiresAt(updateDTO.getExpiresAt());
        }
        if (updateDTO.getTokenStatus() != null) {
            token.setTokenStatus(updateDTO.getTokenStatus());
        }
        if (updateDTO.getTokenType() != null) {
            token.setTokenType(updateDTO.getTokenType());
        }
        if (updateDTO.getGencoId() != null) {
            // Update the related Genco entity
            token.setGenco(gencoRepository.findById(updateDTO.getGencoId())
                    .orElseThrow(() -> new RuntimeException("Genco not found")));
        }
        // Save the updated token
        tokenRepository.save(token);

        // Convert the updated token to the response DTO
        return tokenMapper.toResponseDTO(token);
    }


    @Override
    public void deleteToken(Long id) {
        Token token = tokenRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Token not found"));
        tokenRepository.delete(token);
    }

    @Override
    public TokenResponseDTO getTokenById(Long id) {
        Token token = tokenRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Token not found"));
        return tokenMapper.toResponseDTO(token);
    }

    @Override
    public List<TokenResponseDTO> getAllTokens() {
        return tokenRepository.findAll().stream()
                .map(tokenMapper::toResponseDTO)
                .collect(Collectors.toList());
    }
}

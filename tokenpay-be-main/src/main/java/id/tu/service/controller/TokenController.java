package id.tu.service.controller;

import id.tu.service.domain.dto.token.TokenRequestCreateDTO;
import id.tu.service.domain.dto.token.TokenRequestUpdateDTO;
import id.tu.service.domain.dto.token.TokenResponseDTO;
import id.tu.service.domain.dto.token.TokenResponseSimpleDTO;
import id.tu.service.domain.model.token.Token;
import id.tu.service.domain.service.TokenService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/tokens")
@RequiredArgsConstructor
public class TokenController {

    private final TokenService tokenService;

    @PostMapping
    public ResponseEntity<TokenResponseDTO> createToken(@RequestBody TokenRequestCreateDTO createDTO) {
        TokenResponseDTO response = tokenService.createToken(createDTO);
        return ResponseEntity.ok(response);
    }

    @PutMapping("/{id}")
    public ResponseEntity<TokenResponseDTO> updateToken(@PathVariable Long id, @RequestBody TokenRequestUpdateDTO updateDTO) {
        TokenResponseDTO response = tokenService.updateToken(id, updateDTO);
        return ResponseEntity.ok(response);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteToken(@PathVariable Long id) {
        tokenService.deleteToken(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/{id}")
    public ResponseEntity<TokenResponseDTO> getTokenById(@PathVariable Long id) {
        TokenResponseDTO response = tokenService.getTokenById(id);
        return ResponseEntity.ok(response);
    }

    @GetMapping
    public ResponseEntity<List<TokenResponseDTO>> getAllTokens() {
        List<TokenResponseDTO> response = tokenService.getAllTokens();
        return ResponseEntity.ok(response);
    }
}

package id.tu.service.controller;

import id.tu.service.domain.dto.genco.GencoRequestCreateDTO;
import id.tu.service.domain.dto.genco.GencoRequestUpdateDTO;
import id.tu.service.domain.dto.genco.GencoResponseDTO;
import id.tu.service.domain.dto.genco.GencoResponseSimpleDTO;
import id.tu.service.domain.service.GencoService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/gencos")
@RequiredArgsConstructor
public class GencoController {

    private final GencoService gencoService;

    @PostMapping
    public ResponseEntity<GencoResponseDTO> createGenco(@RequestBody GencoRequestCreateDTO createDTO) {
        GencoResponseDTO response = gencoService.createGenco(createDTO);
        return ResponseEntity.ok(response);
    }

    @PutMapping("/{id}")
    public ResponseEntity<GencoResponseDTO> updateGenco(@PathVariable Long id, @RequestBody GencoRequestUpdateDTO updateDTO) {
        GencoResponseDTO response = gencoService.updateGenco(id, updateDTO);
        return ResponseEntity.ok(response);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteGenco(@PathVariable Long id) {
        gencoService.deleteGenco(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/{id}")
    public ResponseEntity<GencoResponseDTO> getGencoById(@PathVariable Long id) {
        GencoResponseDTO response = gencoService.getGencoById(id);
        return ResponseEntity.ok(response);
    }

    @GetMapping
    public ResponseEntity<List<GencoResponseDTO>> getAllGencos() {
        List<GencoResponseDTO> response = gencoService.getAllGencos();
        return ResponseEntity.ok(response);
    }
}

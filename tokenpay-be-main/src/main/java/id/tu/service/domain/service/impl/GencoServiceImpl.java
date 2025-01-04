package id.tu.service.domain.service.impl;


import id.tu.service.domain.dto.genco.GencoRequestCreateDTO;
import id.tu.service.domain.dto.genco.GencoRequestUpdateDTO;
import id.tu.service.domain.dto.genco.GencoResponseDTO;
import id.tu.service.domain.dto.genco.GencoResponseSimpleDTO;
import id.tu.service.domain.mapper.GencoMapper;
import id.tu.service.domain.model.genco.Genco;

import id.tu.service.domain.repository.GencoRepository;
import id.tu.service.domain.repository.TokenRepository;
import id.tu.service.domain.service.GencoService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class GencoServiceImpl implements GencoService {

    private final GencoRepository gencoRepository;
    private final GencoMapper gencoMapper;

    @Autowired
    private TokenRepository tokenRepository;

    @Override
    public GencoResponseDTO createGenco(GencoRequestCreateDTO createDTO) {
        Genco genco = gencoMapper.toEntity(createDTO);
        gencoRepository.save(genco);
        return gencoMapper.toResponseDTO(genco);
    }

    @Override
    public GencoResponseDTO updateGenco(Long id, GencoRequestUpdateDTO updateDTO) {
        Genco genco = gencoRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Genco not found"));
        gencoMapper.updateEntity(genco, updateDTO);
        gencoRepository.save(genco);
        return gencoMapper.toResponseDTO(genco);
    }

    @Override
    public void deleteGenco(Long id) {
        Genco genco = gencoRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Genco not found"));
        gencoRepository.delete(genco);
    }

    @Override
    public GencoResponseDTO getGencoById(Long id) {
        Genco genco = gencoRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Genco not found"));
        return gencoMapper.toResponseDTO(genco);
    }

    @Override
    public List<GencoResponseDTO> getAllGencos() {
        List<Genco> gencos = gencoRepository.findAll();
        return gencos.stream()
                .map(gencoMapper::toResponseDTO)
                .collect(Collectors.toList());
    }
}

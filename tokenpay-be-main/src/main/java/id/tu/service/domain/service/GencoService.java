package id.tu.service.domain.service;



import id.tu.service.domain.dto.genco.GencoRequestCreateDTO;
import id.tu.service.domain.dto.genco.GencoRequestUpdateDTO;
import id.tu.service.domain.dto.genco.GencoResponseDTO;
import id.tu.service.domain.dto.genco.GencoResponseSimpleDTO;

import java.util.List;

public interface GencoService {

    GencoResponseDTO createGenco(GencoRequestCreateDTO createDTO);

    GencoResponseDTO updateGenco(Long id, GencoRequestUpdateDTO updateDTO);

    void deleteGenco(Long id);

    GencoResponseDTO getGencoById(Long id);

    List<GencoResponseDTO> getAllGencos();
}

package id.tu.service.domain.mapper;


import id.tu.service.domain.dto.genco.GencoRequestCreateDTO;
import id.tu.service.domain.dto.genco.GencoRequestUpdateDTO;
import id.tu.service.domain.dto.genco.GencoResponseDTO;
import id.tu.service.domain.dto.genco.GencoResponseSimpleDTO;
import id.tu.service.domain.model.genco.Genco;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;

import java.util.List;

@Mapper(componentModel = "spring")
public interface GencoMapper {

    // Convert GencoRequestCreateDTO to Genco entity
    Genco toEntity(GencoRequestCreateDTO dto);

    // Update existing Genco entity using GencoRequestUpdateDTO
    @Mapping(target = "id", ignore = true)
    void updateEntity(@MappingTarget Genco entity, GencoRequestUpdateDTO dto);

    // Convert Genco entity to GencoResponseDTO
    GencoResponseDTO toResponseDTO(Genco genco);

    // Convert Genco entity to GencoResponseSimpleDTO
    GencoResponseSimpleDTO toSimpleResponseDTO(Genco genco);

    // Convert list of Genco entities to list of GencoResponseSimpleDTOs
    List<GencoResponseSimpleDTO> toSimpleResponseDTOList(List<Genco> gencos);
}

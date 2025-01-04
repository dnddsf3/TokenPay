package id.tu.service.domain.mapper;


import id.tu.service.domain.dto.role.RoleRequestCreateDTO;
import id.tu.service.domain.dto.role.RoleRequestUpdateDTO;
import id.tu.service.domain.dto.role.RoleResponseDTO;
import id.tu.service.domain.model.user.Role;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;
import org.mapstruct.factory.Mappers;


@Mapper(componentModel = "spring", uses = {UserMapper.class})
public interface RoleMapper {

    RoleMapper INSTANCE = Mappers.getMapper(RoleMapper.class);

    // Map Role entity to RoleResponseDTO
    RoleResponseDTO toResponseDTO(Role role);

    // Map RoleRequestCreateDTO to Role entity
    @Mapping(target = "createdBy", source = "createdById", qualifiedByName = "mapToUser")
    Role toEntity(RoleRequestCreateDTO createDTO);

    // Map RoleRequestUpdateDTO to Role entity
    @Mapping(target = "updatedBy", source = "updatedById", qualifiedByName = "mapToUser")
    Role toEntity(RoleRequestUpdateDTO updateDTO);

    // Update Role entity from RoleRequestUpdateDTO
    @Mapping(target = "updatedBy", source = "updatedById", qualifiedByName = "mapToUser")
    void updateEntityFromDTO(RoleRequestUpdateDTO updateDTO, @MappingTarget Role role);
}

package id.tu.service.domain.mapper;

import id.tu.service.domain.dto.user.UserRequestCreateDTO;
import id.tu.service.domain.dto.user.UserRequestUpdateDTO;
import id.tu.service.domain.dto.user.UserResponseDTO;
import id.tu.service.domain.dto.user.UserResponseSimpleDTO;
import id.tu.service.domain.model.user.Role;
import id.tu.service.domain.model.user.User;
import org.mapstruct.*;

import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@Mapper(componentModel = "spring", uses = {RoleMapper.class, CustomerMapper.class, CustomerMapperHelper.class})
public interface UserMapper {

    // Map User entity to UserResponseDTO
    @Mapping(target = "roles", source = "roles")
    @Mapping(target = "updatedBy", source = "updatedBy")
    @Mapping(target = "createdBy", source = "createdBy")
    UserResponseDTO toResponseDTO(User user);

    // Map UserRequestCreateDTO to User entity
    @Mapping(target = "roles", source = "roleIds", qualifiedByName = "mapRoleIdsToRoles")
    @Mapping(target = "createdBy", source = "createdById", qualifiedByName = "mapToUser")
    @Mapping(source = "customerId", target = "customer", qualifiedByName = "mapCustomerFromId")
    User toEntity(UserRequestCreateDTO createDTO);

    // Map UserRequestUpdateDTO to User entity
    @Mapping(target = "roles", source = "roleIds", qualifiedByName = "mapRoleIdsToRoles")
    @Mapping(target = "updatedBy", source = "updatedById", qualifiedByName = "mapToUser")
    User toEntity(UserRequestUpdateDTO updateDTO);

    // Update an existing User entity from UserRequestUpdateDTO
    @Mapping(target = "roles", source = "roleIds", qualifiedByName = "mapRoleIdsToRoles")
    @Mapping(target = "updatedBy", source = "updatedById", qualifiedByName = "mapToUser")
    void updateEntityFromDTO(UserRequestUpdateDTO updateDTO, @MappingTarget User user);

    // Custom mapping for role IDs to Role entities
    @Named("mapRoleIdsToRoles")
    default Set<Role> mapRoleIdsToRoles(Set<Long> roleIds) {
        return roleIds == null ? null : roleIds.stream()
                .map(id -> {
                    Role role = new Role();
                    role.setId(id);
                    return role;
                })
                .collect(Collectors.toSet());
    }

    @Named("mapToUser")
    default User mapToUser(Long value) {
        if (value == null) {
            return null;
        }
        User user = new User();
        user.setId(value);
        return user;
    }

    UserResponseSimpleDTO toUserResponseSimpleDTO(User user);
    List<UserResponseSimpleDTO> toUserResponseSimpleDTOList(List<User> users);
}

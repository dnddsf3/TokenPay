package id.tu.service.domain.service;

import id.tu.service.domain.dto.role.RoleRequestCreateDTO;
import id.tu.service.domain.dto.role.RoleRequestUpdateDTO;
import id.tu.service.domain.dto.role.RoleResponseDTO;

import java.util.List;

public interface RoleService {

    // Create a new role
    RoleResponseDTO createRole(RoleRequestCreateDTO createDTO);

    // Update an existing role
    RoleResponseDTO updateRole(Long id, RoleRequestUpdateDTO updateDTO);

    // Get role by ID
    RoleResponseDTO getRoleById(Long id);

    // Get role by name
    RoleResponseDTO getRoleByName(String name);

    // Get all roles
    List<RoleResponseDTO> getAllRoles();

    // Delete a role by ID
    void deleteRoleById(Long id);
}

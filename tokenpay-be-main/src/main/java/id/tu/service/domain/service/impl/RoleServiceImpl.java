package id.tu.service.domain.service.impl;

import id.tu.service.domain.dto.role.RoleRequestCreateDTO;
import id.tu.service.domain.dto.role.RoleRequestUpdateDTO;
import id.tu.service.domain.dto.role.RoleResponseDTO;
import id.tu.service.domain.mapper.RoleMapper;
import id.tu.service.domain.model.user.Role;
import id.tu.service.domain.repository.RoleRepository;
import id.tu.service.domain.service.RoleService;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class RoleServiceImpl implements RoleService {

    private final RoleRepository roleRepository;
    private final RoleMapper roleMapper;

    public RoleServiceImpl(RoleRepository roleRepository, RoleMapper roleMapper) {
        this.roleRepository = roleRepository;
        this.roleMapper = roleMapper;
    }

    @Override
    public RoleResponseDTO createRole(RoleRequestCreateDTO createDTO) {
        Role role = roleMapper.toEntity(createDTO);
        Role savedRole = roleRepository.save(role);
        return roleMapper.toResponseDTO(savedRole);
    }

    @Override
    public RoleResponseDTO updateRole(Long id, RoleRequestUpdateDTO updateDTO) {
        Role role = roleRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Role not found"));
        roleMapper.updateEntityFromDTO(updateDTO, role);
        Role updatedRole = roleRepository.save(role);
        return roleMapper.toResponseDTO(updatedRole);
    }

    @Override
    public RoleResponseDTO getRoleById(Long id) {
        Role role = roleRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Role not found"));
        return roleMapper.toResponseDTO(role);
    }

    @Override
    public RoleResponseDTO getRoleByName(String name) {
        Role role = roleRepository.findByName(name)
                .orElseThrow(() -> new RuntimeException("Role not found"));
        return roleMapper.toResponseDTO(role);
    }

    @Override
    public List<RoleResponseDTO> getAllRoles() {
        return roleRepository.findAll()
                .stream()
                .map(roleMapper::toResponseDTO)
                .collect(Collectors.toList());
    }

    @Override
    public void deleteRoleById(Long id) {
        if (!roleRepository.existsById(id)) {
            throw new RuntimeException("Role not found");
        }
        roleRepository.deleteById(id);
    }
}

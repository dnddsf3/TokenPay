package id.tu.service.controller;

import id.tu.service.domain.dto.role.RoleRequestCreateDTO;
import id.tu.service.domain.dto.role.RoleRequestUpdateDTO;
import id.tu.service.domain.dto.role.RoleResponseDTO;
import id.tu.service.domain.service.RoleService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/roles")
public class RoleController {

    private final RoleService roleService;

    public RoleController(RoleService roleService) {
        this.roleService = roleService;
    }

    @PostMapping
    public ResponseEntity<RoleResponseDTO> createRole(@RequestBody RoleRequestCreateDTO createDTO) {
        RoleResponseDTO response = roleService.createRole(createDTO);
        return ResponseEntity.ok(response);
    }

    @PutMapping("/{id}")
    public ResponseEntity<RoleResponseDTO> updateRole(@PathVariable Long id, @RequestBody RoleRequestUpdateDTO updateDTO) {
        RoleResponseDTO response = roleService.updateRole(id, updateDTO);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/{id}")
    public ResponseEntity<RoleResponseDTO> getRoleById(@PathVariable Long id) {
        RoleResponseDTO response = roleService.getRoleById(id);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/name/{name}")
    public ResponseEntity<RoleResponseDTO> getRoleByName(@PathVariable String name) {
        RoleResponseDTO response = roleService.getRoleByName(name);
        return ResponseEntity.ok(response);
    }

    @GetMapping
    public ResponseEntity<List<RoleResponseDTO>> getAllRoles() {
        List<RoleResponseDTO> response = roleService.getAllRoles();
        return ResponseEntity.ok(response);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteRole(@PathVariable Long id) {
        roleService.deleteRoleById(id);
        return ResponseEntity.noContent().build();
    }
}

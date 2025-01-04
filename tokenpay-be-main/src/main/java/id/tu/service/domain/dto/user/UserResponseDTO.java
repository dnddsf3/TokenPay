package id.tu.service.domain.dto.user;


import id.tu.service.domain.dto.customer.CustomerResponseSimpleDTO;
import id.tu.service.domain.dto.role.RoleResponseDTO;
import id.tu.service.domain.model.user.UserStatus;
import lombok.Data;

import java.time.LocalDateTime;
import java.util.Set;

@Data
public class UserResponseDTO {

    private Long id;

    private String username;

    private String password;

    private String email;

    private Set<RoleResponseDTO> roles;

    private UserStatus status;

    private LocalDateTime createdAt;

    private LocalDateTime updatedAt;

    private UserResponseSimpleDTO createdBy;

    private UserResponseSimpleDTO updatedBy;

    private CustomerResponseSimpleDTO customer;
}

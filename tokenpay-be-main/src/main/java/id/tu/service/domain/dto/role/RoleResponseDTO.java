package id.tu.service.domain.dto.role;

import lombok.Data;

import java.time.LocalDateTime;

@Data
public class RoleResponseDTO {

    private Long id;

    private String name;

    private String description;

    private LocalDateTime createdAt;

    private LocalDateTime updatedAt;
}

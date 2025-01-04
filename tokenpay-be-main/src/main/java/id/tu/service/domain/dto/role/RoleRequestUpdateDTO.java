package id.tu.service.domain.dto.role;

import lombok.Data;

@Data
public class RoleRequestUpdateDTO {
    private Long id;
    private String name;
    private String description;
    private Long updatedById;
}

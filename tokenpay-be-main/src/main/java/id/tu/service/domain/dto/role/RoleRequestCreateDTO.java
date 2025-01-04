package id.tu.service.domain.dto.role;

import lombok.Data;

@Data
public class RoleRequestCreateDTO {
    private String name;
    private String description;
    private Long createdById;
}

package id.tu.service.domain.dto.user;

import id.tu.service.domain.model.user.UserStatus;
import lombok.Data;

import java.util.Set;

@Data
public class UserRequestCreateDTO {
    private String username;
    private String email;
    private String password;
    private Set<Long> roleIds;
    private UserStatus status;
    private Long createdById;
    private Long customerId;
}

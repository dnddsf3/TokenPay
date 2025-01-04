package id.tu.service.domain.dto.user;


import id.tu.service.domain.dto.customer.CustomerResponseSimpleDTO;
import lombok.Data;

@Data
public class UserResponseSimpleDTO {
    private Long id;
    private String username;
    private String email;
    private CustomerResponseSimpleDTO customer;
}

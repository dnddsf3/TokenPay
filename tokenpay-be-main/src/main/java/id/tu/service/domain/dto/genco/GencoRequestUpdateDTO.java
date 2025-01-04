package id.tu.service.domain.dto.genco;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class GencoRequestUpdateDTO {

    private Long id;

    private String name;

    private String address;

    private String contactNumber;

    private String email;

    private Boolean isActive;
}
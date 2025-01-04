package id.tu.service.domain.dto.genco;

import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter
public class GencoResponseDTO {

    private Long id;

    private String name;

    private String address;

    private String contactNumber;

    private String email;

    private Boolean isActive;

    private LocalDateTime createdAt;

    private LocalDateTime updatedAt;
}

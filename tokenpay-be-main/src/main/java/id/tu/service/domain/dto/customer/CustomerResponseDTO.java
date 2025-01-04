package id.tu.service.domain.dto.customer;

import id.tu.service.domain.model.customer.CustomerStatus;
import id.tu.service.domain.model.customer.CustomerType;
import id.tu.service.domain.model.customer.TariffType;
import id.tu.service.domain.dto.payment.PaymentResponseSimpleDTO;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;
import java.util.List;

@Getter
@Setter
public class CustomerResponseDTO {

    private Long id;

    private String name;

    private String email;

    private String phoneNumber;

    private String address;

    private String meterNumber;

    private TariffType tariffType;

    private Long gencoId;

    private String gencoName; // Optional field for Genco name

    private Boolean isActive;

    private LocalDateTime createdAt;

    private LocalDateTime updatedAt;

    private CustomerType customerType;

    private CustomerStatus customerStatus;

    private String avatar;

    private String note;

    private Long userId;

    private String userName;

    private List<PaymentResponseSimpleDTO> payments;
}

package id.tu.service.domain.dto.customer;


import id.tu.service.domain.model.customer.CustomerStatus;
import id.tu.service.domain.model.customer.CustomerType;
import id.tu.service.domain.model.customer.TariffType;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class CustomerRequestUpdateDTO {

    private Long id;

    private String name;

    private String email;

    private String phoneNumber;

    private String address;

    private String meterNumber;

    private TariffType tariffType;

    private Long gencoId;

    private CustomerType customerType;

    private CustomerStatus customerStatus;

    private String avatar;

    private String note;

    private Long userId; // Optional user association
}

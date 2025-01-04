package id.tu.service.domain.mapper;

import id.tu.service.domain.dto.customer.CustomerRequestCreateDTO;
import id.tu.service.domain.dto.customer.CustomerRequestUpdateDTO;
import id.tu.service.domain.dto.customer.CustomerResponseDTO;
import id.tu.service.domain.dto.customer.CustomerResponseSimpleDTO;
import id.tu.service.domain.dto.payment.PaymentResponseSimpleDTO;
import id.tu.service.domain.model.customer.Customer;

import org.mapstruct.*;
import java.util.List;
import java.util.stream.Collectors;

@Mapper(componentModel = "spring")
public interface CustomerMapper {

    // Convert from CustomerRequestCreateDTO to Customer entity
    Customer toEntity(CustomerRequestCreateDTO dto);

    // Update existing Customer entity with CustomerRequestUpdateDTO
    @Mapping(target = "id", ignore = true)
    void updateEntity(@MappingTarget Customer entity, CustomerRequestUpdateDTO dto);

    // Convert from Customer entity to CustomerResponseDTO
    @Mapping(source = "genco.id", target = "gencoId")
    @Mapping(source = "genco.name", target = "gencoName")
    @Mapping(source = "user.id", target = "userId")
    @Mapping(source = "user.username", target = "userName")
    @Mapping(target = "payments", expression = "java(mapPayments(customer))")
    CustomerResponseDTO toResponseDTO(Customer customer);

    // Convert from Customer entity to CustomerResponseSimpleDTO
    CustomerResponseSimpleDTO toSimpleResponseDTO(Customer customer);

    // Convert list of Customer entities to list of CustomerResponseSimpleDTO
    List<CustomerResponseSimpleDTO> toSimpleResponseDTOList(List<Customer> customers);

    // Helper method to map payments to PaymentResponseSimpleDTO
    default List<PaymentResponseSimpleDTO> mapPayments(Customer customer) {
        if (customer.getPayments() == null) return null;

        return customer.getPayments().stream().map(payment -> {
            PaymentResponseSimpleDTO dto = new PaymentResponseSimpleDTO();
            dto.setId(payment.getId());
            dto.setAmountPaid(payment.getAmountPaid());
            dto.setPaymentMethod(payment.getPaymentMethod());
            dto.setPaymentStatus(payment.getPaymentStatus());
            dto.setTimestamp(payment.getTimestamp());
            return dto;
        }).collect(Collectors.toList());
    }
}

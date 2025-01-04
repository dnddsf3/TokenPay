package id.tu.service.domain.mapper;

import id.tu.service.domain.dto.payment.PaymentRequestCreateDTO;
import id.tu.service.domain.dto.payment.PaymentRequestUpdateDTO;
import id.tu.service.domain.dto.payment.PaymentResponseDTO;
import id.tu.service.domain.model.customer.Customer;
import id.tu.service.domain.model.payment.Payment;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;
import org.mapstruct.Named;

import java.util.List;

@Mapper(componentModel = "spring",uses = {CustomerMapperHelper.class})
public interface PaymentMapper {

    @Mapping(source = "tokenId", target = "token.id")
    @Mapping(source = "customerId", target = "customer", qualifiedByName = "mapCustomerFromId")
    Payment toEntity(PaymentRequestCreateDTO createDTO);

    void updateEntity(@MappingTarget Payment payment, PaymentRequestUpdateDTO updateDTO);

    @Mapping(source = "token", target = "token")
    @Mapping(source = "token.tokenCode", target = "tokenCode")
    @Mapping(source = "customer", target = "customer")
    @Mapping(source = "customer.name", target = "customerName")
    PaymentResponseDTO toResponseDTO(Payment payment);

    List<PaymentResponseDTO> toResponseDTOList(List<Payment> payments);


}

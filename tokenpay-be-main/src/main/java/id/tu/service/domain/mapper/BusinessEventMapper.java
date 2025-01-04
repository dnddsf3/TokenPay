package id.tu.service.domain.mapper;


import id.tu.service.domain.dto.event.BusinessEventCreateDTO;
import id.tu.service.domain.dto.event.BusinessEventResponseDTO;
import id.tu.service.domain.model.notif.BusinessEvent;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;

@Mapper(componentModel = "spring")
public interface BusinessEventMapper {

    @Mapping(source = "customerId", target = "customer.id")
    @Mapping(source = "tokenBillId", target = "tokenBill.id")
    @Mapping(source = "paymentId", target = "payment.id")
    BusinessEvent toEntity(BusinessEventCreateDTO createDTO);

    @Mapping(source = "customer.name", target = "customerName")
    @Mapping(source = "tokenBill.tokenCode", target = "tokenCode")
    @Mapping(source = "payment.amountPaid", target = "paymentAmount")
    BusinessEventResponseDTO toResponseDTO(BusinessEvent event);

    void updateEntity(@MappingTarget BusinessEvent event, BusinessEventCreateDTO createDTO);
}

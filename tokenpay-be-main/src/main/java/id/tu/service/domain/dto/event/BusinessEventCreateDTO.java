package id.tu.service.domain.dto.event;


import id.tu.service.domain.model.notif.BusinessEventType;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class BusinessEventCreateDTO {

    private String eventName;

    private BusinessEventType eventType;

    private String description;

    private Long customerId;

    private Long tokenBillId;

    private Long paymentId;

    private String occurredAt;
}

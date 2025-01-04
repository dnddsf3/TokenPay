package id.tu.service.domain.dto.event;

import id.tu.service.domain.model.notif.BusinessEventType;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter
public class BusinessEventResponseDTO {

    private Long id;

    private String eventName;

    private BusinessEventType eventType;

    private String description;

    private String customerName;

    private String tokenCode;

    private Double paymentAmount;

    private LocalDateTime occurredAt;

    private LocalDateTime createdAt;
}

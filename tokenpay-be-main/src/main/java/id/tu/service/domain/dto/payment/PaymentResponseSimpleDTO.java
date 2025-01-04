package id.tu.service.domain.dto.payment;


import id.tu.service.domain.model.payment.PaymentMethod;
import id.tu.service.domain.model.payment.PaymentStatus;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter
public class PaymentResponseSimpleDTO {

    private Long id;

    private Double amountPaid;

    private Long userId;

    private PaymentMethod paymentMethod;

    private PaymentStatus paymentStatus;

    private LocalDateTime timestamp;
}

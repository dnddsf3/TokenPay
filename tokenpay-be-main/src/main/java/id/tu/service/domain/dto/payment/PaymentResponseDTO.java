package id.tu.service.domain.dto.payment;

import id.tu.service.domain.dto.customer.CustomerResponseSimpleDTO;
import id.tu.service.domain.dto.token.TokenResponseDTO;
import id.tu.service.domain.dto.token.TokenResponseSimpleDTO;
import id.tu.service.domain.model.payment.PaymentMethod;
import id.tu.service.domain.model.payment.PaymentPromo;
import id.tu.service.domain.model.payment.PaymentStatus;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter
public class PaymentResponseDTO {

    private Long id;

    private String paymentId;

    private TokenResponseSimpleDTO token;

    private String tokenCode;

    private CustomerResponseSimpleDTO customer;

    private String customerName;

    private Double energyUsage;

    private Long userId;

    private String wa;

    private Double amountPaid;

    private Double ppn;

    private Double ppj;

    private Double materai;

    private Double bankFee;

    private Double serviceFee;

    private Double total;

    private PaymentMethod paymentMethod;

    private String qris;

    private PaymentStatus paymentStatus;

    private String paymentPromo;

    private LocalDateTime timestamp;

    private String note;
}

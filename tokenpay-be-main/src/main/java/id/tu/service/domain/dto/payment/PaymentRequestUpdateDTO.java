package id.tu.service.domain.dto.payment;


import id.tu.service.domain.model.payment.PaymentMethod;
import id.tu.service.domain.model.payment.PaymentPromo;
import id.tu.service.domain.model.payment.PaymentStatus;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class PaymentRequestUpdateDTO {

    private Long id;

    private Long tokenId;

    private Long customerId;

    private Double energyUsage;

    private Double amountPaid;

    private Long userId;

    private String wa;

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

    private String note;
}

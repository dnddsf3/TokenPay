package id.tu.service.domain.model.payment;

import id.tu.service.domain.model.customer.Customer;
import id.tu.service.domain.model.token.Token;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import org.hibernate.annotations.OnDelete;
import org.hibernate.annotations.OnDeleteAction;

import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "payments")
@Setter @Getter
public class Payment {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id; //ref number

    private String paymentId; //UUID auto generated

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "token_id", nullable = false)
    private Token token;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "customer_id", nullable = false)
    @OnDelete(action = OnDeleteAction.SET_NULL)
    private Customer customer;

    private Double energyUsage;

    private Long userId;

    private String wa;

    @Column(nullable = false)
    private Double amountPaid;

    private Double ppn;

    private Double ppj;

    private Double materai;

    private Double bankFee;

    private Double serviceFee;

    private Double total;

    @Column(nullable = false, length = 50)
    @Enumerated(EnumType.STRING)
    private PaymentMethod paymentMethod;

    private String qris;

    @Column(nullable = false, length = 20)
    private PaymentStatus paymentStatus; // e.g., SUCCESS, FAILED

    private String paymentPromo;

    @Column(nullable = false)
    private LocalDateTime timestamp;

    private String note;

    @PrePersist
    protected void onCreate() {
        paymentId = UUID.randomUUID().toString();
        timestamp = LocalDateTime.now();
    }
}

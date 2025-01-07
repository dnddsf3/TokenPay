package id.tu.service.domain.model.notif;

import id.tu.service.domain.model.customer.Customer;
import id.tu.service.domain.model.payment.Payment;
import id.tu.service.domain.model.token.Token;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import org.hibernate.annotations.OnDelete;
import org.hibernate.annotations.OnDeleteAction;

import java.time.LocalDateTime;

@Entity
@Table(name = "events")
@Getter
@Setter
public class BusinessEvent {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 100)
    private String eventName;

    @Column(nullable = false, length = 50)
    private BusinessEventType eventType; // e.g., PAYMENT, TOKEN_ISSUE, CUSTOMER_REGISTRATION

    @Column(length = 255)
    private String description;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "customer_id", nullable = true)
    @OnDelete(action = OnDeleteAction.SET_NULL)
    private Customer customer;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "token_id", nullable = true)
    @OnDelete(action = OnDeleteAction.SET_NULL)
    private Token tokenBill;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "trx_id", nullable = true)
    @OnDelete(action = OnDeleteAction.SET_NULL)
    private Payment payment;

    @Column(nullable = false)
    private LocalDateTime occurredAt;

    @Column(nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        occurredAt = LocalDateTime.now();
    }
}

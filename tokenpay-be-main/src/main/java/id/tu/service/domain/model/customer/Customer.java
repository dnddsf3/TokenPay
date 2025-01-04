package id.tu.service.domain.model.customer;

import id.tu.service.domain.model.genco.Genco;
import id.tu.service.domain.model.payment.Payment;
import id.tu.service.domain.model.user.User;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;
import java.util.List;

@Entity
@Table(name = "customers")
@Setter @Getter
public class Customer {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = true, length = 100)
    private String name;

    @Column(nullable = true, unique = true, length = 100)
    private String email;

    @Column(nullable = true, unique = true, length = 15)
    private String phoneNumber;

    @Column(nullable = true, length = 255)
    private String address;

    @Column(nullable = true, unique = true, length = 50)
    private String meterNumber;

    @Enumerated(EnumType.STRING)
    private TariffType tariffType;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "genco_id", nullable = true)
    private Genco genco;

    @Column(nullable = true)
    private Boolean isActive = true;

    @Column(nullable = true, updatable = false)
    private LocalDateTime createdAt;

    @Column(nullable = true)
    private LocalDateTime updatedAt;

    @Enumerated(EnumType.STRING)
    private CustomerType customerType;

    @Enumerated(EnumType.STRING)
    private CustomerStatus customerStatus;

    private String avatar;

    private String note;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = true)
    private User user;

    @OneToMany(
            mappedBy = "customer",
            cascade = CascadeType.ALL,
            orphanRemoval = true,
            fetch = FetchType.LAZY
    )
    private List<Payment> payments;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }
}

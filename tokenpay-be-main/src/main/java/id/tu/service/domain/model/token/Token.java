package id.tu.service.domain.model.token;

import id.tu.service.domain.model.genco.Genco;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import org.hibernate.annotations.OnDelete;
import org.hibernate.annotations.OnDeleteAction;

import java.time.LocalDateTime;

@Entity
@Table(name = "token")
@Setter @Getter
public class Token {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id; //ref

    @Column(nullable = false, unique = true, length = 50)
    private String tokenCode; //UUID

    @Column(nullable = false)
    private Double amount; //price

    @Column(nullable = false)
    private Double amountEconomic; //price

    @Column(nullable = false)
    private Double unitsPurchased; //kwh

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "genco_id", nullable = true)
    @OnDelete(action = OnDeleteAction.SET_NULL)
    private Genco genco;

    @Column(nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @Column(nullable = false)
    private LocalDateTime expiresAt;

    @Enumerated(EnumType.STRING)
    private TokenStatus tokenStatus;

    @Enumerated(EnumType.STRING)
    private TokenType tokenType;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
    }
}

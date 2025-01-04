package id.tu.service.domain.init;

import id.tu.service.domain.model.customer.Customer;
import id.tu.service.domain.model.payment.Payment;
import id.tu.service.domain.model.payment.PaymentMethod;
import id.tu.service.domain.model.payment.PaymentPromo;
import id.tu.service.domain.model.payment.PaymentStatus;
import id.tu.service.domain.model.token.Token;
import id.tu.service.domain.repository.CustomerRepository;
import id.tu.service.domain.repository.PaymentRepository;
import id.tu.service.domain.repository.TokenRepository;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.core.annotation.Order;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;
import java.util.Optional;

@Component
@Order(6)
@Slf4j
public class PaymentDataInitializer implements CommandLineRunner {

    private final PaymentRepository paymentRepository;
    private final TokenRepository tokenRepository;
    private final CustomerRepository customerRepository;

    @Autowired
    public PaymentDataInitializer(PaymentRepository paymentRepository,
                                  TokenRepository tokenRepository,
                                  CustomerRepository customerRepository) {
        this.paymentRepository = paymentRepository;
        this.tokenRepository = tokenRepository;
        this.customerRepository = customerRepository;
    }

    @Override
    public void run(String... args) {
        if (paymentRepository.count() == 0) {
            Optional<Token> token = tokenRepository.findById(1L);
            Optional<Customer> customer = customerRepository.findById(1L);

            if (token.isPresent() && customer.isPresent()) {
                log.info("Initializing 100 payment records for Token: {} and Customer: {}", token.get().getTokenCode(), customer.get().getName());
                for (int i = 1; i <= 100; i++) {
                    Payment payment = new Payment();
                    payment.setToken(token.get());
                    payment.setCustomer(customer.get());
                    payment.setEnergyUsage(100.0 + i); // Incremental energy usage
                    payment.setAmountPaid(120.0 + i * 10); // Incremental payment amount
                    payment.setPpn(10.0 + i % 5); // Varying PPN
                    payment.setPpj(5.0 + i % 3); // Varying PPJ
                    payment.setMaterai(2.0 + i % 2); // Varying Materai
                    payment.setBankFee(1.5 + (i % 2 == 0 ? 0.5 : 0)); // Conditional increment
                    payment.setServiceFee(2.5 + (i % 3 == 0 ? 0.5 : 0)); // Conditional increment
                    payment.setTotal(payment.getAmountPaid() + payment.getPpn() + payment.getPpj() + payment.getMaterai() + payment.getBankFee() + payment.getServiceFee());
                    payment.setPaymentMethod(PaymentMethod.values()[i % PaymentMethod.values().length]); // Rotate through payment methods
                    payment.setPaymentStatus(PaymentStatus.values()[i % PaymentStatus.values().length]); // Rotate through payment statuses
                    payment.setPaymentPromo("QWTE009"); // Rotate through payment promos
                    payment.setTimestamp(LocalDateTime.now().minusDays(i % 30)); // Varying timestamps
                    payment.setNote("Payment record #" + i);
                    payment.setWa("9085757575757575");
                    payment.setUserId(Integer.toUnsignedLong(i));

                    paymentRepository.save(payment);
                }
                log.info("100 payment records initialized successfully!");
            } else {
                log.warn("Required Token or Customer data not found. Skipping Payment initialization.");
            }
        } else {
            log.info("Payment data already exists. Skipping initialization.");
        }
    }
}

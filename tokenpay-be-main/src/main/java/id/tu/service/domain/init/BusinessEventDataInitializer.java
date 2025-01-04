package id.tu.service.domain.init;

import id.tu.service.domain.model.customer.Customer;
import id.tu.service.domain.model.notif.BusinessEvent;
import id.tu.service.domain.model.notif.BusinessEventType;
import id.tu.service.domain.model.payment.Payment;
import id.tu.service.domain.model.token.Token;
import id.tu.service.domain.repository.BusinessEventRepository;
import id.tu.service.domain.repository.CustomerRepository;
import id.tu.service.domain.repository.PaymentRepository;
import id.tu.service.domain.repository.TokenRepository;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.core.annotation.Order;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.Random;

@Component
@Order(7)
@Slf4j
public class BusinessEventDataInitializer implements CommandLineRunner {

    private final BusinessEventRepository eventRepository;
    private final CustomerRepository customerRepository;
    private final TokenRepository tokenRepository;
    private final PaymentRepository paymentRepository;

    @Autowired
    public BusinessEventDataInitializer(
            BusinessEventRepository eventRepository,
            CustomerRepository customerRepository,
            TokenRepository tokenRepository,
            PaymentRepository paymentRepository) {
        this.eventRepository = eventRepository;
        this.customerRepository = customerRepository;
        this.tokenRepository = tokenRepository;
        this.paymentRepository = paymentRepository;
    }

    @Override
    public void run(String... args) {
        if (eventRepository.count() == 0) {
            log.info("Initializing 100 BusinessEvent records...");

            List<Customer> customers = customerRepository.findAll();
            List<Token> tokens = tokenRepository.findAll();
            List<Payment> payments = paymentRepository.findAll();

            if (customers.isEmpty() || tokens.isEmpty() || payments.isEmpty()) {
                log.warn("Required data (customers, tokens, payments) is missing. Skipping event initialization.");
                return;
            }

            Random random = new Random();
            for (int i = 1; i <= 100; i++) {
                BusinessEvent event = new BusinessEvent();
                event.setEventName("Event #" + i);
                event.setEventType(random.nextBoolean() ? BusinessEventType.PAYMENT : BusinessEventType.PAYMENT);
                event.setDescription("Generated event description for Event #" + i);
                event.setCustomer(customers.get(random.nextInt(customers.size())));
                event.setTokenBill(tokens.get(random.nextInt(tokens.size())));
                event.setPayment(payments.get(random.nextInt(payments.size())));
                event.setOccurredAt(LocalDateTime.now().minusDays(random.nextInt(30)));

                eventRepository.save(event);
                log.info("Initialized BusinessEvent #{}", i);
            }

            log.info("100 BusinessEvent records initialized successfully!");
        } else {
            log.info("BusinessEvent data already exists. Skipping initialization.");
        }
    }
}

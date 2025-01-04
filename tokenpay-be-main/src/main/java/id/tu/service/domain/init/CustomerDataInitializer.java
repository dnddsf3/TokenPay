package id.tu.service.domain.init;

import id.tu.service.domain.model.customer.Customer;
import id.tu.service.domain.model.customer.CustomerStatus;
import id.tu.service.domain.model.customer.CustomerType;
import id.tu.service.domain.model.customer.TariffType;
import id.tu.service.domain.repository.CustomerRepository;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.core.annotation.Order;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;

@Component
@Order(2)
@Slf4j
public class CustomerDataInitializer implements CommandLineRunner {

    private final CustomerRepository customerRepository;

    @Autowired
    public CustomerDataInitializer(CustomerRepository customerRepository) {
        this.customerRepository = customerRepository;
    }

    @Override
    public void run(String... args) throws Exception {
        if (customerRepository.count() == 0) {
            log.info("Initializing 50 Customer records...");

            for (int i = 1; i <= 5; i++) {
                Customer customer = new Customer();
                customer.setName("Customer #" + i);
                customer.setEmail("customer" + i + "@example.com");
                customer.setPhoneNumber("08" + String.format("%09d", i));
                customer.setAddress(i % 2 == 0 ? "Address #" + i + " Main St" : "Address #" + i + " Elm St");
                customer.setMeterNumber("MTR-" + String.format("%03d", i));
                customer.setTariffType(i % 2 == 0 ? TariffType.PREPAID : TariffType.POSTPAID);
                customer.setCustomerType(i % 3 == 0 ? CustomerType.COMMERCIAL : CustomerType.RESIDENTIAL);
                customer.setCustomerStatus(i % 5 == 0 ? CustomerStatus.INACTIVE : CustomerStatus.ACTIVE);
                customer.setAvatar("https://avatar.com");
                customer.setIsActive(i % 7 != 0); // Alternate between true and false
                customer.setNote("Generated customer #" + i);
                customer.setCreatedAt(LocalDateTime.now().minusDays(i));
                customer.setUpdatedAt(LocalDateTime.now());

                customerRepository.save(customer);
            }

            log.info("50 Customer records initialized successfully!");
        } else {
            log.info("Customer data already exists. Skipping initialization.");
        }
    }
}

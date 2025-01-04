package id.tu.service.domain.init;

import id.tu.service.domain.model.customer.Customer;
import id.tu.service.domain.model.customer.CustomerStatus;
import id.tu.service.domain.model.customer.CustomerType;
import id.tu.service.domain.model.customer.TariffType;
import id.tu.service.domain.model.user.Role;
import id.tu.service.domain.model.user.User;
import id.tu.service.domain.model.user.UserStatus;
import id.tu.service.domain.repository.CustomerRepository;
import id.tu.service.domain.repository.RoleRepository;
import id.tu.service.domain.repository.UserRepository;
import jakarta.transaction.Transactional;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.core.annotation.Order;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.Optional;
import java.util.Set;

@Component
@Slf4j
@Order(3)
public class UserDataInitializer implements CommandLineRunner {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private CustomerRepository customerRepository;

    @Autowired
    private RoleRepository roleRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Transactional
    @Override
    public void run(String... args) throws Exception {
        initializeUsers();
    }

    private void initializeUsers() {
        // Query roles from RoleRepository
        Role adminRole = getRoleFromRepository("ADMIN");
        Role userRole = getRoleFromRepository("USER");
        Role managerRole = getRoleFromRepository("MANAGER");


        if (adminRole == null || userRole == null || managerRole == null) {
            log.error("Roles must be initialized before creating users. Please check the RoleDataInitializer.");
            return;
        }

        log.info("Roles fetched from database: ADMIN, USER, MANAGER");

        // Generate 50 users
        for (int i = 1; i <= 50; i++) {
            User user = new User();
            user.setUsername("user" + i);
            user.setEmail("user" + i + "@example.com");
            String hashedPassword = passwordEncoder.encode("password" + i);
            user.setPassword(hashedPassword);
            user.setCreatedAt(LocalDateTime.now());
            user.setUpdatedAt(LocalDateTime.now());
            user.setStatus(UserStatus.ACTIVE);

            // Assign roles based on conditions
            Set<Role> userRoles = new HashSet<>();
            if (i % 10 == 0) {
                userRoles.add(adminRole); // Assign admin role to every 10th user
            } else if (i % 5 == 0) {
                userRoles.add(managerRole); // Assign manager role to every 5th user
            } else {
                userRoles.add(userRole); // Assign user role to the rest
            }
            user.setRoles(userRoles);

            Customer customer = createOrFetchCustomerForUser(1L);
            user.setCustomer(customer);
            // Persist user
            userRepository.save(user);
            log.info("Created user: {}", user.getUsername());
        }
        log.info("50 users successfully initialized.");
    }

    private Role getRoleFromRepository(String roleName) {
        Optional<Role> role = roleRepository.findByName(roleName);
        if (role.isEmpty()) {
            log.error("Role '{}' not found in the database. Please initialize roles before running this initializer.", roleName);
            return null;
        }
        return role.get();
    }


    private Customer createOrFetchCustomerForUser(Long i) {
        return customerRepository.findById(i)
                .orElseGet(() -> {
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
                    log.info("Created new customer: {}", customer.getName());
                    return customer;
                });
    }
}

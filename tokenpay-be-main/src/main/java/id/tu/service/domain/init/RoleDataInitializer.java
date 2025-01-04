package id.tu.service.domain.init;

import id.tu.service.domain.model.user.Role;
import id.tu.service.domain.repository.RoleRepository;
import jakarta.transaction.Transactional;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.core.annotation.Order;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;
import java.util.List;

@Component
@Slf4j
@Order(1)
public class RoleDataInitializer implements CommandLineRunner {

    @Autowired
    private RoleRepository roleRepository;

    @Transactional
    @Override
    public void run(String... args) throws Exception {
        initializeRoles();
    }

    private void initializeRoles() {
        // Check if roles already exist to prevent duplicate initialization
        if (roleRepository.count() > 0) {
            log.info("Roles already initialized. Skipping role initialization.");
            return;
        }

        // List of role names and descriptions
        List<Role> roles = List.of(
                createRole("ADMIN", "Administrator with full access"),
                createRole("USER", "Regular user with limited access"),
                createRole("MANAGER", "Manager role with elevated permissions"),
                createRole("SUPPORT", "Support staff role"),
                createRole("HR", "Human Resources role"),
                createRole("IT", "IT Department role"),
                createRole("FINANCE", "Finance Department role"),
                createRole("MARKETING", "Marketing role"),
                createRole("SALES", "Sales role"),
                createRole("DEVELOPER", "Software Developer role")
        );

        // Save all roles to the database
        roleRepository.saveAll(roles);
        log.info("10 roles successfully initialized.");
    }

    private Role createRole(String name, String description) {
        Role role = new Role();
        role.setName(name);
        role.setDescription(description);
        role.setCreatedAt(LocalDateTime.now());
        role.setUpdatedAt(LocalDateTime.now());
        return role;
    }
}


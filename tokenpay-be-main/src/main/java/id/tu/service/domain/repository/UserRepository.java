package id.tu.service.domain.repository;

import id.tu.service.domain.model.user.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {
    // Find a user by username
    Optional<User> findByUsername(String username);

    // Check if a user exists by email
    boolean existsByEmail(String email);
}

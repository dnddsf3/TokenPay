package id.tu.service.domain.repository;


import id.tu.service.domain.model.customer.Customer;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface CustomerRepository extends JpaRepository<Customer, Long> {
    Customer findByMeterNumber(String meterNumber);
    Customer findByEmail(String email);
}

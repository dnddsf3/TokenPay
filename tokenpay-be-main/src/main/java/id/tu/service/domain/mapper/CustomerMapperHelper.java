package id.tu.service.domain.mapper;

import id.tu.service.domain.model.customer.Customer;
import id.tu.service.domain.repository.CustomerRepository;
import org.mapstruct.Named;
import org.springframework.stereotype.Component;

@Component
public class CustomerMapperHelper {

    private final CustomerRepository customerRepository;

    public CustomerMapperHelper(CustomerRepository customerRepository) {
        this.customerRepository = customerRepository;
    }

    @Named("mapCustomerFromId")
    public Customer mapCustomer(Long customerId) {
        if (customerId == null) {
            return null;
        }
        return customerRepository.findById(customerId)
                .orElseThrow(() -> new IllegalArgumentException("Customer not found with id: " + customerId));
    }
}

package id.tu.service.domain.service;
import id.tu.service.domain.dto.customer.CustomerRequestCreateDTO;
import id.tu.service.domain.dto.customer.CustomerRequestUpdateDTO;
import id.tu.service.domain.dto.customer.CustomerResponseDTO;
import id.tu.service.domain.dto.customer.CustomerResponseSimpleDTO;

import java.util.List;

public interface CustomerService {

    CustomerResponseDTO createCustomer(CustomerRequestCreateDTO createDTO);

    CustomerResponseDTO updateCustomer(Long id, CustomerRequestUpdateDTO updateDTO);

    void deleteCustomer(Long id);

    CustomerResponseDTO getCustomerById(Long id);

    List<CustomerResponseDTO> getAllCustomers();
}

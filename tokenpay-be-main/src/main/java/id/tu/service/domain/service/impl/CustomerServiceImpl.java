package id.tu.service.domain.service.impl;

import id.tu.service.domain.dto.customer.CustomerRequestCreateDTO;
import id.tu.service.domain.dto.customer.CustomerRequestUpdateDTO;
import id.tu.service.domain.dto.customer.CustomerResponseDTO;
import id.tu.service.domain.dto.customer.CustomerResponseSimpleDTO;
import id.tu.service.domain.mapper.CustomerMapper;
import id.tu.service.domain.model.customer.Customer;

import id.tu.service.domain.repository.CustomerRepository;
import id.tu.service.domain.service.CustomerService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class CustomerServiceImpl implements CustomerService {

    private final CustomerRepository customerRepository;
    private final CustomerMapper customerMapper;

    @Override
    public CustomerResponseDTO createCustomer(CustomerRequestCreateDTO createDTO) {
        Customer customer = customerMapper.toEntity(createDTO);
        customerRepository.save(customer);
        return customerMapper.toResponseDTO(customer);
    }

//    @Override
//    public CustomerResponseDTO updateCustomer(Long id, CustomerRequestUpdateDTO updateDTO) {
//        Customer customer = customerRepository.findById(id)
//                .orElseThrow(() -> new RuntimeException("Customer not found"));
//        customerMapper.updateEntity(customer, updateDTO);
//        customerRepository.save(customer);
//        return customerMapper.toResponseDTO(customer);
//    }

    @Override
    public CustomerResponseDTO updateCustomer(Long id, CustomerRequestUpdateDTO updateDTO) {
        Customer customer = customerRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Customer not found"));

        // Manually update the fields of the existing entity
        if (updateDTO.getName() != null) {
            customer.setName(updateDTO.getName());
        }
        if (updateDTO.getEmail() != null) {
            customer.setEmail(updateDTO.getEmail());
        }
        if (updateDTO.getPhoneNumber() != null) {
            customer.setPhoneNumber(updateDTO.getPhoneNumber());
        }
        if (updateDTO.getAddress() != null) {
            customer.setAddress(updateDTO.getAddress());
        }
        if (updateDTO.getMeterNumber() != null) {
            customer.setMeterNumber(updateDTO.getMeterNumber());
        }
        if (updateDTO.getTariffType() != null) {
            customer.setTariffType(updateDTO.getTariffType());
        }
        if (updateDTO.getCustomerType() != null) {
            customer.setCustomerType(updateDTO.getCustomerType());
        }
        if (updateDTO.getCustomerStatus() != null) {
            customer.setCustomerStatus(updateDTO.getCustomerStatus());
        }
        if (updateDTO.getAvatar() != null) {
            customer.setAvatar(updateDTO.getAvatar());
        }
        if (updateDTO.getNote() != null) {
            customer.setNote(updateDTO.getNote());
        }

        // Save the updated entity
        customerRepository.save(customer);

        // Map the updated entity to the response DTO
        return customerMapper.toResponseDTO(customer);
    }


    @Override
    public void deleteCustomer(Long id) {
        Customer customer = customerRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Customer not found"));
        customerRepository.delete(customer);
    }

    @Override
    public CustomerResponseDTO getCustomerById(Long id) {
        Customer customer = customerRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Customer not found"));
        return customerMapper.toResponseDTO(customer);
    }

    @Override
    public List<CustomerResponseDTO> getAllCustomers() {
        List<Customer> customers = customerRepository.findAll();
        return customers.stream()
                .map(customerMapper::toResponseDTO)
                .collect(Collectors.toList());
    }
}

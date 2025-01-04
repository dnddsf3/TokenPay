package id.tu.service.controller;


import id.tu.service.domain.dto.customer.CustomerRequestCreateDTO;
import id.tu.service.domain.dto.customer.CustomerRequestUpdateDTO;
import id.tu.service.domain.dto.customer.CustomerResponseDTO;
import id.tu.service.domain.dto.customer.CustomerResponseSimpleDTO;
import id.tu.service.domain.service.CustomerService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/customers")
@RequiredArgsConstructor
public class CustomerController {

    private final CustomerService customerService;

    @PostMapping
    public ResponseEntity<CustomerResponseDTO> createCustomer(@RequestBody CustomerRequestCreateDTO createDTO) {
        CustomerResponseDTO response = customerService.createCustomer(createDTO);
        return ResponseEntity.ok(response);
    }

    @PutMapping("/{id}")
    public ResponseEntity<CustomerResponseDTO> updateCustomer(@PathVariable Long id, @RequestBody CustomerRequestUpdateDTO updateDTO) {
        CustomerResponseDTO response = customerService.updateCustomer(id, updateDTO);
        return ResponseEntity.ok(response);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteCustomer(@PathVariable Long id) {
        customerService.deleteCustomer(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/{id}")
    public ResponseEntity<CustomerResponseDTO> getCustomerById(@PathVariable Long id) {
        CustomerResponseDTO response = customerService.getCustomerById(id);
        return ResponseEntity.ok(response);
    }

    @GetMapping
    public ResponseEntity<List<CustomerResponseDTO>> getAllCustomers() {
        List<CustomerResponseDTO> response = customerService.getAllCustomers();
        return ResponseEntity.ok(response);
    }
}

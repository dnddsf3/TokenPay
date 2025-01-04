package id.tu.service.controller;

import id.tu.service.domain.dto.payment.PaymentRequestCreateDTO;
import id.tu.service.domain.dto.payment.PaymentRequestUpdateDTO;
import id.tu.service.domain.dto.payment.PaymentResponseDTO;
import id.tu.service.domain.service.PaymentService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/payments")
@RequiredArgsConstructor
public class PaymentController {

    private final PaymentService paymentService;

    @PostMapping
    public ResponseEntity<PaymentResponseDTO> createPayment(@RequestBody PaymentRequestCreateDTO createDTO) {
        PaymentResponseDTO response = paymentService.createPayment(createDTO);
        return ResponseEntity.ok(response);
    }

    @PutMapping("/{id}")
    public ResponseEntity<PaymentResponseDTO> updatePayment(@PathVariable Long id, @RequestBody PaymentRequestUpdateDTO updateDTO) {
        PaymentResponseDTO response = paymentService.updatePayment(id, updateDTO);
        return ResponseEntity.ok(response);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletePayment(@PathVariable Long id) {
        paymentService.deletePayment(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/{id}")
    public ResponseEntity<PaymentResponseDTO> getPaymentById(@PathVariable Long id) {
        PaymentResponseDTO response = paymentService.getPaymentById(id);
        return ResponseEntity.ok(response);
    }

    @GetMapping
    public ResponseEntity<List<PaymentResponseDTO>> getAllPayments() {
        List<PaymentResponseDTO> response = paymentService.getAllPayments();
        return ResponseEntity.ok(response);
    }

    @GetMapping("/userid/{id}")
    public ResponseEntity<List<PaymentResponseDTO>> getAllPaymentsByUserId(@PathVariable Long id) {
        List<PaymentResponseDTO> response = paymentService.findAllByUserId(id);
        return ResponseEntity.ok(response);
    }
}

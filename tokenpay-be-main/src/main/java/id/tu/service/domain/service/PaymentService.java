package id.tu.service.domain.service;


import id.tu.service.domain.dto.payment.PaymentRequestCreateDTO;
import id.tu.service.domain.dto.payment.PaymentRequestUpdateDTO;
import id.tu.service.domain.dto.payment.PaymentResponseDTO;
import id.tu.service.domain.model.token.Token;

import java.util.List;

public interface PaymentService {
    PaymentResponseDTO createPayment(PaymentRequestCreateDTO createDTO);

    PaymentResponseDTO updatePayment(Long id, PaymentRequestUpdateDTO updateDTO);

    void deletePayment(Long id);

    PaymentResponseDTO getPaymentById(Long id);

    List<PaymentResponseDTO> getAllPayments();

    List<PaymentResponseDTO> findAllByUserId(Long userId);
}

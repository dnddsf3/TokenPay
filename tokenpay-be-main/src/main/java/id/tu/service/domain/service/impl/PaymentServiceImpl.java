package id.tu.service.domain.service.impl;

import id.tu.service.domain.dto.payment.PaymentRequestCreateDTO;
import id.tu.service.domain.dto.payment.PaymentRequestUpdateDTO;
import id.tu.service.domain.dto.payment.PaymentResponseDTO;
import id.tu.service.domain.mapper.PaymentMapper;
import id.tu.service.domain.model.customer.Customer;
import id.tu.service.domain.model.payment.Payment;
import id.tu.service.domain.model.token.Token;

import id.tu.service.domain.repository.CustomerRepository;
import id.tu.service.domain.repository.PaymentRepository;
import id.tu.service.domain.repository.TokenRepository;
import id.tu.service.domain.service.PaymentService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class PaymentServiceImpl implements PaymentService {

    private final PaymentRepository paymentRepository;
    private final CustomerRepository customerRepository;
    private final TokenRepository tokenRepository;
    private final PaymentMapper paymentMapper;

    @Override
    public PaymentResponseDTO createPayment(PaymentRequestCreateDTO createDTO) {
        Payment payment = paymentMapper.toEntity(createDTO);

        Token token = tokenRepository.findById(createDTO.getTokenId())
                .orElseThrow(() -> new RuntimeException("Token not found"));
        Customer customer = customerRepository.findById(createDTO.getCustomerId())
                .orElseThrow(() -> new RuntimeException("Customer not found"));

        payment.setToken(token);
        payment.setCustomer(customer);
        paymentRepository.save(payment);

        return paymentMapper.toResponseDTO(payment);
    }

    @Override
    public PaymentResponseDTO updatePayment(Long id, PaymentRequestUpdateDTO updateDTO) {
        Payment payment = paymentRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Payment not found"));

        // Manual field mapping from updateDTO to payment
        if (updateDTO.getTokenId() != null) {
            Token token = tokenRepository.findById(updateDTO.getTokenId())
                    .orElseThrow(() -> new RuntimeException("Token not found"));
            payment.setToken(token);
        }

        if (updateDTO.getCustomerId() != null) {
            Customer customer = customerRepository.findById(updateDTO.getCustomerId())
                    .orElseThrow(() -> new RuntimeException("Customer not found"));
            payment.setCustomer(customer);
        }

        if (updateDTO.getEnergyUsage() != null) {
            payment.setEnergyUsage(updateDTO.getEnergyUsage());
        }

        if (updateDTO.getAmountPaid() != null) {
            payment.setAmountPaid(updateDTO.getAmountPaid());
        }

        if (updateDTO.getPpn() != null) {
            payment.setPpn(updateDTO.getPpn());
        }

        if (updateDTO.getPpj() != null) {
            payment.setPpj(updateDTO.getPpj());
        }

        if (updateDTO.getMaterai() != null) {
            payment.setMaterai(updateDTO.getMaterai());
        }

        if (updateDTO.getBankFee() != null) {
            payment.setBankFee(updateDTO.getBankFee());
        }

        if (updateDTO.getServiceFee() != null) {
            payment.setServiceFee(updateDTO.getServiceFee());
        }

        if (updateDTO.getTotal() != null) {
            payment.setTotal(updateDTO.getTotal());
        }

        if (updateDTO.getPaymentMethod() != null) {
            payment.setPaymentMethod(updateDTO.getPaymentMethod());
        }

        if (updateDTO.getQris() != null) {
            payment.setQris(updateDTO.getQris());
        }

        if (updateDTO.getPaymentStatus() != null) {
            payment.setPaymentStatus(updateDTO.getPaymentStatus());
        }

        if (updateDTO.getPaymentPromo() != null) {
            payment.setPaymentPromo(updateDTO.getPaymentPromo());
        }

        if (updateDTO.getNote() != null) {
            payment.setNote(updateDTO.getNote());
        }

        // Save updated payment to the repository
        paymentRepository.save(payment);

        // Convert the updated entity to a response DTO and return it
        return paymentMapper.toResponseDTO(payment);
    }


    @Override
    public void deletePayment(Long id) {
        Payment payment = paymentRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Payment not found"));
        paymentRepository.delete(payment);
    }

    @Override
    public PaymentResponseDTO getPaymentById(Long id) {
        Payment payment = paymentRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Payment not found"));
        return paymentMapper.toResponseDTO(payment);
    }

    @Override
    public List<PaymentResponseDTO> getAllPayments() {
        return paymentRepository.findAll().stream()
                .map(paymentMapper::toResponseDTO)
                .collect(Collectors.toList());
    }

    @Override
    public List<PaymentResponseDTO> findAllByUserId(Long userId) {
        return paymentMapper.toResponseDTOList(paymentRepository.findByUserId(userId));
    }
}

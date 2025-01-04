package id.tu.service.domain.service.impl;


import id.tu.service.domain.dto.event.BusinessEventCreateDTO;
import id.tu.service.domain.dto.event.BusinessEventResponseDTO;
import id.tu.service.domain.mapper.BusinessEventMapper;
import id.tu.service.domain.model.notif.BusinessEvent;

import id.tu.service.domain.repository.BusinessEventRepository;
import id.tu.service.domain.service.BusinessEventService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class BusinessEventServiceImpl implements BusinessEventService {

    private final BusinessEventRepository eventRepository;
    private final BusinessEventMapper eventMapper;

    @Override
    public BusinessEventResponseDTO createEvent(BusinessEventCreateDTO createDTO) {
        BusinessEvent event = eventMapper.toEntity(createDTO);
        eventRepository.save(event);
        return eventMapper.toResponseDTO(event);
    }

    @Override
    public List<BusinessEventResponseDTO> getAllEvents() {
        return eventRepository.findAll().stream()
                .map(eventMapper::toResponseDTO)
                .collect(Collectors.toList());
    }

    @Override
    public BusinessEventResponseDTO getEventById(Long id) {
        BusinessEvent event = eventRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Event not found"));
        return eventMapper.toResponseDTO(event);
    }
}

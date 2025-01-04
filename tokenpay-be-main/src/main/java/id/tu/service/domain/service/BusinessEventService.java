package id.tu.service.domain.service;


import id.tu.service.domain.dto.event.BusinessEventCreateDTO;
import id.tu.service.domain.dto.event.BusinessEventResponseDTO;

import java.util.List;

public interface BusinessEventService {
    BusinessEventResponseDTO createEvent(BusinessEventCreateDTO createDTO);

    List<BusinessEventResponseDTO> getAllEvents();

    BusinessEventResponseDTO getEventById(Long id);
}

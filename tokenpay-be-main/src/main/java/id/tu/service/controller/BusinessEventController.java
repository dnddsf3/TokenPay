package id.tu.service.controller;

import id.tu.service.domain.dto.event.BusinessEventCreateDTO;
import id.tu.service.domain.dto.event.BusinessEventResponseDTO;
import id.tu.service.domain.service.BusinessEventService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/events")
@RequiredArgsConstructor
public class BusinessEventController {

    private final BusinessEventService eventService;

    @PostMapping
    public ResponseEntity<BusinessEventResponseDTO> createEvent(@RequestBody BusinessEventCreateDTO createDTO) {
        return ResponseEntity.ok(eventService.createEvent(createDTO));
    }

    @GetMapping
    public ResponseEntity<List<BusinessEventResponseDTO>> getAllEvents() {
        return ResponseEntity.ok(eventService.getAllEvents());
    }

    @GetMapping("/{id}")
    public ResponseEntity<BusinessEventResponseDTO> getEventById(@PathVariable Long id) {
        return ResponseEntity.ok(eventService.getEventById(id));
    }
}

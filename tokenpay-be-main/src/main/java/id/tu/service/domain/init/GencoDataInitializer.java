package id.tu.service.domain.init;

import id.tu.service.domain.model.genco.Genco;
import id.tu.service.domain.repository.GencoRepository;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.core.annotation.Order;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;

@Component
@Order(4)
@Slf4j
public class GencoDataInitializer implements CommandLineRunner {

    private final GencoRepository gencoRepository;

    @Autowired
    public GencoDataInitializer(GencoRepository gencoRepository) {
        this.gencoRepository = gencoRepository;
    }

    @Override
    public void run(String... args) {
        if (gencoRepository.count() == 0) {
            log.info("Initializing 50 Genco records...");

            for (int i = 1; i <= 5; i++) {
                Genco genco = new Genco();
                genco.setName("Genco #" + i);
                genco.setAddress("Address #" + i + ", City " + (char) ('A' + (i % 26)));
                genco.setContactNumber("08" + String.format("%09d", i));
                genco.setEmail("contact@genco" + i + ".com");
                genco.setIsActive(i % 2 == 0); // Alternate between active and inactive
                genco.setCreatedAt(LocalDateTime.now().minusDays(i));
                genco.setUpdatedAt(LocalDateTime.now());

                gencoRepository.save(genco);
            }

            log.info("50 Genco records initialized successfully!");
        } else {
            log.info("Genco data already exists. Skipping initialization.");
        }
    }
}

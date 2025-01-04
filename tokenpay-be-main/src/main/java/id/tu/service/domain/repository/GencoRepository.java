package id.tu.service.domain.repository;


import id.tu.service.domain.model.genco.Genco;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface GencoRepository extends JpaRepository<Genco, Long> {
    // Additional query methods can be added here if needed
}

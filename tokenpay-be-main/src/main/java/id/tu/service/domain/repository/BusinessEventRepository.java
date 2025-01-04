package id.tu.service.domain.repository;

import id.tu.service.domain.model.notif.BusinessEvent;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface BusinessEventRepository extends JpaRepository<BusinessEvent, Long> {
}

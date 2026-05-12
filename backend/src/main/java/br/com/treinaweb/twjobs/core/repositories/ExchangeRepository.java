package br.com.treinaweb.twjobs.core.repositories;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import br.com.treinaweb.twjobs.core.models.Exchange;

@Repository
public interface ExchangeRepository extends JpaRepository<Exchange, Long> {

    Optional<Exchange> findById(Long id);

    @Query("""
        select e from Exchange e
        join fetch e.book b
        join fetch e.fromUser fu
        join fetch e.toUser tu
        where fu.id = :userId or tu.id = :userId
        order by e.id desc
    """)
    List<Exchange> findAllByParticipantId(Long userId);
}

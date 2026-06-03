package br.com.treinaweb.twjobs.core.repositories;


import br.com.treinaweb.twjobs.core.models.Exchange;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.Optional;

@Repository
public interface ExchangeRepository extends JpaRepository <Exchange, Long>{
    Page<Exchange> findAll(Pageable pageable);
    Optional<Exchange> findById(Long id);
//    boolean existsByNome(Long nome);
//    boolean existsByNomeAndIdNot(Long nome, Long id);




}

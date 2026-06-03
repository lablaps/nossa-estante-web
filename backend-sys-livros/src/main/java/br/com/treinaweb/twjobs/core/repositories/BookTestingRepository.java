package br.com.treinaweb.twjobs.core.repositories;

import br.com.treinaweb.twjobs.api.booksTesting.dtos.BookTestingResponse;
import br.com.treinaweb.twjobs.core.models.BookTesting;
import br.com.treinaweb.twjobs.core.models.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface BookTestingRepository extends JpaRepository <BookTesting, Long>{
    Page<BookTesting> findAllByUserId(Pageable pageable, Long userId);
    Optional<BookTesting> findByIdAndUserId(Long id, Long userId);
//    boolean existsByNome(Long nome);
//    boolean existsByNomeAndIdNot(Long nome, Long id);




}

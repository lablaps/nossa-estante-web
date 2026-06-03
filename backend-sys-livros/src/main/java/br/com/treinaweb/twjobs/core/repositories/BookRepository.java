package br.com.treinaweb.twjobs.core.repositories;

import br.com.treinaweb.twjobs.api.books.dtos.BookResponse;
import br.com.treinaweb.twjobs.core.models.Book;
import br.com.treinaweb.twjobs.core.models.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface BookRepository extends JpaRepository <Book, Long>{
    Page<Book> findAllByUserId(Pageable pageable, Long userId);
    Optional<Book> findByIdAndUserId(Long id, Long userId);


    Page<Book> findAllByOrderByIdDesc(Pageable pageable);


//    boolean existsByNome(Long nome);
//    boolean existsByNomeAndIdNot(Long nome, Long id);




}

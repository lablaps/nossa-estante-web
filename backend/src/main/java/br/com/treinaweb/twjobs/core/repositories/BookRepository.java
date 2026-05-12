package br.com.treinaweb.twjobs.core.repositories;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import br.com.treinaweb.twjobs.core.models.Book;

@Repository
public interface BookRepository extends JpaRepository<Book, Long> {

    List<Book> findAllByOrderByIdDesc();

    List<Book> findAllByUserIdOrderByIdDesc(Long userId);

    Optional<Book> findById(Long id);
}

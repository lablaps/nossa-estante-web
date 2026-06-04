package br.com.treinaweb.twjobs.core.repositories;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import br.com.treinaweb.twjobs.core.models.Book;
import br.com.treinaweb.twjobs.core.models.User;
import br.com.treinaweb.twjobs.core.models.UserData;

@Repository
public interface UserDataRepository extends JpaRepository<UserData, Long>{


    // Page<Book> findAllByUserId(Pageable pageable, Long userId);
    // Optional<Book> findByIdAndUserId(Long id, Long userId);

    Optional<UserData> findByUserId(Long id);

}

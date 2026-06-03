package br.com.treinaweb.twjobs.core.repositories;

import java.util.List;
import java.util.Optional;

import br.com.treinaweb.twjobs.core.enums.Role;
import org.springframework.data.jpa.repository.JpaRepository;

import br.com.treinaweb.twjobs.core.models.User;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface UserRepository extends JpaRepository<User, Long> {

    Optional<User> findByEmail(String email);
    User findNameByEmail(String email);

    // Optional<User> findById(Long id);

    //Como uso código SQL aqui então (talvez) dependendo do PC a sintaxe pode causar erro, ou não.
    @Query(value = "SELECT role FROM User WHERE role = (SELECT role FROM User WHERE email=:customer) LIMIT 1;", nativeQuery = true)
    List<Role> findTheRoleByEmail(@Param("customer") String email);

    Boolean existsByEmail(String email);

}

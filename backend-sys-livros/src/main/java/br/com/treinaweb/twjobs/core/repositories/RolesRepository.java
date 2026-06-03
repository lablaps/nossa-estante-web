package br.com.treinaweb.twjobs.core.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import br.com.treinaweb.twjobs.core.models.Roles;

@Repository
public interface RolesRepository extends JpaRepository<Roles, Long> {}

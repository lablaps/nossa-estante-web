package br.com.treinaweb.twjobs.core.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import br.com.treinaweb.twjobs.core.models.Coordinates;

@Repository
public interface CoordinatesRepository extends JpaRepository<Coordinates, Long>{

}

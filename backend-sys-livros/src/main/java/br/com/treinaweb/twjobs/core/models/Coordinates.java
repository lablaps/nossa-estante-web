package br.com.treinaweb.twjobs.core.models;



import java.math.BigDecimal;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.ManyToOne;
import lombok.*;


@Data
@Entity
@Builder
@NoArgsConstructor
@AllArgsConstructor
@ToString(onlyExplicitlyIncluded=true)
@EqualsAndHashCode(onlyExplicitlyIncluded=true)
public class Coordinates {

    // Modificated (16/06/2026)

    @Id
    @EqualsAndHashCode.Include
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // longitude - x
    private BigDecimal longitude;
    // latitude - y
    private BigDecimal latitude;

    // relation one-to-many
    // @ToString.Include
    // @ManyToOne
    // private Geometry geometry;


}

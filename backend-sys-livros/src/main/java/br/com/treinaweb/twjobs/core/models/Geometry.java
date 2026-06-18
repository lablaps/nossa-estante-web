package br.com.treinaweb.twjobs.core.models;

import java.util.List;

import br.com.treinaweb.twjobs.core.enums.GeoType;
import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import jakarta.persistence.OneToOne;
import lombok.*;


@Data
@Entity
@Builder
@NoArgsConstructor
@AllArgsConstructor
@ToString(onlyExplicitlyIncluded=true)
@EqualsAndHashCode(onlyExplicitlyIncluded=true)
public class Geometry {

    // Modificated (16/06/2026)

    @Id
    @EqualsAndHashCode.Include
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne(mappedBy = "geometry")
    private User user;

    // type/enum
    @Column(nullable = false)
    @Enumerated(EnumType.STRING)
    private GeoType geoType;

    @ToString.Include
    @OneToMany
    private List<Coordinates> coordinates;

}

package br.com.treinaweb.twjobs.core.models;
import jakarta.persistence.*;
import lombok.*;

@Data
@Entity
@Builder
@NoArgsConstructor
@AllArgsConstructor
@ToString(onlyExplicitlyIncluded=true)
@EqualsAndHashCode(onlyExplicitlyIncluded=true)
public class UserData {
    
    // Modificated (16/06/2026)


    @Id
    @EqualsAndHashCode.Include
    @GeneratedValue(strategy = GenerationType.IDENTITY)

    private Long id;

    // @OneToOne(mappedBy="userData")
    @OneToOne
    private User user;

    private String text;

    // // Geoloc fields
    // @OneToOne(cascade = CascadeType.ALL)
    // private Geometry geometry;

    // New mapping
    private String cpf;
    private String birthDate;
    private String phone;
    private String profession;
    private String linkedInstitution;
    private String position;
    private String organization;
    private String department;



}

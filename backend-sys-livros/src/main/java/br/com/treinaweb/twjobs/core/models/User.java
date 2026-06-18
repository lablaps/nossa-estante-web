package br.com.treinaweb.twjobs.core.models;

import org.hibernate.annotations.ColumnDefault;

import br.com.treinaweb.twjobs.core.enums.Role;
import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.OneToOne;
import jakarta.persistence.PrimaryKeyJoinColumn;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;
import lombok.ToString;

@Data
// @Entity(name="user_project") When Postgresql / Production
@Entity(name="user_project")
@Builder
@NoArgsConstructor
@AllArgsConstructor
@ToString(onlyExplicitlyIncluded = true)
@EqualsAndHashCode(onlyExplicitlyIncluded = true)
public class User {

    @Id
    @ToString.Include
    @EqualsAndHashCode.Include
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 100)
    private String name;

    @ToString.Include
    @Column(nullable = false, unique = true)
    private String email;

    @Column(nullable = false)
    private String password;

    @Column(nullable = false)
    @Enumerated(EnumType.STRING)
    private Role role;
    
    @Column(nullable = true)
    private String text;    
    
    // @ColumnDefault(Boolean.valueOf ("0"))
    @Column(columnDefinition = "boolean default false")
    @Builder.Default
    private Boolean verified = false;
    
    // @OneToOne
    // @JoinColumn(name="userData_id", referencedColumnName="id")
    // @OneToOne
    // @PrimaryKeyJoinColumn
    // private UserData userData;

    // Geoloc fields
    @Builder.Default
    @OneToOne(cascade = CascadeType.ALL)
    @JoinColumn(name = "geometry_id", referencedColumnName = "id")
    private Geometry geometry = null;


    // New Mapping
    private String passwordConfirmation;

    private String roleDescription;

}

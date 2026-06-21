package br.com.treinaweb.twjobs.api.users.dtos;

import java.math.BigDecimal;

import br.com.treinaweb.twjobs.core.enums.GeoType;
import br.com.treinaweb.twjobs.core.enums.Role;
import br.com.treinaweb.twjobs.core.models.Geometry;
import jakarta.persistence.*;
import lombok.*;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UserResponse {

    private Long id;
    private String name;
    private String email;
    private String password;
    private Role role;
    private Boolean sendEmail;
    private boolean verified;
     
    private String geometry;

    // latitude - x
    private BigDecimal longitude;
    // latitude - y
    private BigDecimal latitude;
    // type
    private GeoType geoType;
}

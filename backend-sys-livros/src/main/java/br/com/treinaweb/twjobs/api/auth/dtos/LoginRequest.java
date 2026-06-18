package br.com.treinaweb.twjobs.api.auth.dtos;

import java.math.BigDecimal;

import br.com.treinaweb.twjobs.core.enums.GeoType;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotEmpty;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class LoginRequest {

    @Email
    @NotEmpty
    private String email;
    
    @NotEmpty
    private String password;

    // longitude - x
    private BigDecimal longitude;
    // latitude - y
    private BigDecimal latitude;
    // type
    private GeoType geoType;

    
}

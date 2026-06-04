package br.com.treinaweb.twjobs.api.users.dtos;

import br.com.treinaweb.twjobs.core.enums.Role;
import jakarta.persistence.*;
import lombok.*;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UserRequest {

    private String name;

    private String email;

    private String password;

    
    private Role role;
    
    private boolean verified;

    // private Boolean sendEmail;

    // Came from the new mapping
    

    

}

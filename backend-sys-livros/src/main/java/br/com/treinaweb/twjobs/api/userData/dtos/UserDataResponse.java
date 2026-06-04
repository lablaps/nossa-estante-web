package br.com.treinaweb.twjobs.api.userData.dtos;


import br.com.treinaweb.twjobs.core.models.Comment;
import br.com.treinaweb.twjobs.core.models.Genre;
import br.com.treinaweb.twjobs.core.models.User;
import jakarta.persistence.Column;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.ManyToOne;
import lombok.*;

import java.math.BigDecimal;
import java.util.Date;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@EqualsAndHashCode(callSuper = false)
public class UserDataResponse {


    private Long id;
    
    private String text;

    private String user;
    // Representação simples do usuário (evita expor a entidade inteira)
    // private Long userId;

    // // Opcional: pode adicionar mais informações do usuário
    // private String userName;

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

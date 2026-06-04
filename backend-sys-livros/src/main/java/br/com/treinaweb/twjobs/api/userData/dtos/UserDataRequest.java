package br.com.treinaweb.twjobs.api.userData.dtos;


import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;
import lombok.ToString;

import java.math.BigDecimal;
import java.util.List;

import jakarta.persistence.Column;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.ManyToOne;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UserDataRequest {

    // Normalmente não se envia o ID no request (criação)
    // Mas pode ser útil em updates
    // private Long id;

    // Em vez de enviar o objeto User inteiro,
    // o ideal é enviar apenas o ID

    // Adicionar pela RestController
    // private Long userId;

    private String text;

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

package br.com.treinaweb.twjobs.api.exchanges.dtos;


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
public class ExchangeRequest {
  
    // private Long book_id;

    private Long to_user;

    private boolean status_a;

    private boolean status_b;

    private Long book_a_id;

    private Long book_b_id;

}

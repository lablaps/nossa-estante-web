package br.com.treinaweb.twjobs.api.exchanges.dtos;


import br.com.treinaweb.twjobs.core.models.Book;
import br.com.treinaweb.twjobs.core.models.Comment;
import br.com.treinaweb.twjobs.core.models.Genre;
import br.com.treinaweb.twjobs.core.models.User;
import jakarta.persistence.Column;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToOne;
import lombok.*;

import java.math.BigDecimal;
import java.util.Date;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@EqualsAndHashCode(callSuper = false)
public class ExchangeResponse {

    private Long id;

    private String from_user;
    
    private String to_user;
    
    private boolean status_a;
    
    private boolean status_b;
    
    private boolean status_total;
    
    private String book_a;
    
    private String book_b;

    // private String book;

}

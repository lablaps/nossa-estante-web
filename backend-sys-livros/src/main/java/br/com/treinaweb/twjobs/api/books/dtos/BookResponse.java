package br.com.treinaweb.twjobs.api.books.dtos;


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
public class BookResponse {

    private Long id;

    private String user;

    private String title;
    
    private String author;

    private String coverURL;

    private String synopses;

    private int pageCount;

    private String publisher;

    private String publishedDate;

    private String isbn10;

    private String isbn13;

    private String language;

    private String edition;

    private String material_state;

    private String physicalFormat;

    private String publishPlace;

    private String status;

    private BigDecimal cost;

    private String gender;

    private List<String> contributors;


}

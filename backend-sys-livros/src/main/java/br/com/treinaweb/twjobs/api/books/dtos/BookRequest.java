package br.com.treinaweb.twjobs.api.books.dtos;


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
public class BookRequest {
// ~~~ System inputs
//     private Long id;

//     private User user;
    
//     private Date date;

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

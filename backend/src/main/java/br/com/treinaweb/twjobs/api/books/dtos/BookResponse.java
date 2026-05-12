package br.com.treinaweb.twjobs.api.books.dtos;

import java.math.BigDecimal;
import java.util.List;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@EqualsAndHashCode(callSuper = false)
public class BookResponse {

    private Long id;
    private Long userId;
    private String ownerName;
    private String title;
    private String author;
    private String coverURL;
    private String synopses;
    private Integer pageCount;
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

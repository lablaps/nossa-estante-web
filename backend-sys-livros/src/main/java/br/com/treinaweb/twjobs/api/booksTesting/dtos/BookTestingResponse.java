package br.com.treinaweb.twjobs.api.booksTesting.dtos;


import br.com.treinaweb.twjobs.core.models.Comment;
import br.com.treinaweb.twjobs.core.models.Genre;
import br.com.treinaweb.twjobs.core.models.User;
import lombok.*;

import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@EqualsAndHashCode(callSuper = false)
public class BookTestingResponse {

    private Long id;
    private String name;
    private String pub_date;
    private String synopsis;
//    private List<Genre> genres;
//    private List<Comment> comments;
    private String user;
    private String author;
    private Boolean isForTrade;
    private String state;
    private String imageUrls;
    private String desiredTradeBooks;


}

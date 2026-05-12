package br.com.treinaweb.twjobs.api.booksTesting.dtos;


import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class BookTestingRequest {

       private String name;
       private String pub_date;
       private String synopsis;
       private List<Long> genre;
//     comments: When user gonna add a book he doens`t add comments.
       private String author;
       private Boolean isForTrade;
       private String state;
       private String imageUrls;
       private String desiredTradeBooks;



}

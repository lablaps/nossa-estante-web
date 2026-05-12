package br.com.treinaweb.twjobs.api.exchanges.dtos;

import com.fasterxml.jackson.annotation.JsonAlias;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ExchangeRequest {

    @JsonAlias({"book_id", "bookId"})
    private Long bookId;

    @JsonAlias({"to_user", "toUserId"})
    private Long toUserId;

    private String meetingPoint;
}

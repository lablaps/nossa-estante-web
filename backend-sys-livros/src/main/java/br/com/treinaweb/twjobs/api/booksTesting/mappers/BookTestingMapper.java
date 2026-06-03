package br.com.treinaweb.twjobs.api.booksTesting.mappers;//package br.com.treinaweb.twjobs.api.ships.mappers;

import br.com.treinaweb.twjobs.api.booksTesting.dtos.BookTestingRequest;
import br.com.treinaweb.twjobs.api.booksTesting.dtos.BookTestingResponse;
import br.com.treinaweb.twjobs.core.models.BookTesting;

//
//import br.com.treinaweb.twjobs.api.ships.dtos.ShipRequest;
//import br.com.treinaweb.twjobs.api.ships.dtos.ShipResponse;
//import br.com.treinaweb.twjobs.core.models.Skill;
//
public interface BookTestingMapper {
//

   BookTesting toBook(BookTestingRequest bookRequest);

    BookTestingResponse toBookResponse(BookTesting book);
//
}

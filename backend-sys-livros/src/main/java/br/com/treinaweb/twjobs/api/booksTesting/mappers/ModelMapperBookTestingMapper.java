package br.com.treinaweb.twjobs.api.booksTesting.mappers;


import br.com.treinaweb.twjobs.api.booksTesting.dtos.BookTestingRequest;
import br.com.treinaweb.twjobs.api.booksTesting.dtos.BookTestingResponse;
import br.com.treinaweb.twjobs.core.models.BookTesting;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Component;



@Component
@RequiredArgsConstructor
public class ModelMapperBookTestingMapper implements BookTestingMapper {

    private final ModelMapper modelMapper;

    @Override
    public BookTestingResponse toBookResponse(BookTesting book) {
        return modelMapper.map(book, BookTestingResponse.class);
    }

    @Override
    public BookTesting toBook(@Valid BookTestingRequest bookRequest) {
        return modelMapper.map(bookRequest, BookTesting.class);
    }

}


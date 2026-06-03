package br.com.treinaweb.twjobs.api.books.mappers;


import br.com.treinaweb.twjobs.api.books.dtos.BookRequest;
import br.com.treinaweb.twjobs.api.books.dtos.BookResponse;
import br.com.treinaweb.twjobs.core.models.Book;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Component;



@Component
@RequiredArgsConstructor
public class ModelMapperBookMapper implements BookMapper {

    private final ModelMapper modelMapper;

    @Override
    public BookResponse toBookResponse(Book book) {
        return modelMapper.map(book, BookResponse.class);
    }

    @Override
    public Book toBook(@Valid BookRequest bookRequest) {
        return modelMapper.map(bookRequest, Book.class);
    }

}


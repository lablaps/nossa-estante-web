package br.com.treinaweb.twjobs.api.books.assemblers;

import org.springframework.hateoas.CollectionModel;
import org.springframework.hateoas.EntityModel;
import org.springframework.hateoas.server.SimpleRepresentationModelAssembler;
import org.springframework.stereotype.Component;

import br.com.treinaweb.twjobs.api.books.dtos.BookResponse;

@Component
public class BookAssembler implements SimpleRepresentationModelAssembler<BookResponse> {

    @Override
    public void addLinks(EntityModel<BookResponse> resource) {
        // HATEOAS disabled for the local monolith API.
    }

    @Override
    public void addLinks(CollectionModel<EntityModel<BookResponse>> resources) {
        // HATEOAS disabled for the local monolith API.
    }
}

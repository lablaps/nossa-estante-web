package br.com.treinaweb.twjobs.api.books.assemblers;//package br.com.treinaweb.twjobs.api.ships.assemblers;

import br.com.treinaweb.twjobs.api.books.controllers.BookRestController;
import br.com.treinaweb.twjobs.api.books.dtos.BookResponse;
import org.springframework.hateoas.CollectionModel;
import org.springframework.hateoas.EntityModel;
import org.springframework.hateoas.Link;
import org.springframework.hateoas.server.SimpleRepresentationModelAssembler;
import org.springframework.stereotype.Component;

import com.fasterxml.jackson.core.JsonProcessingException;

import static org.springframework.hateoas.server.mvc.WebMvcLinkBuilder.linkTo;
import static org.springframework.hateoas.server.mvc.WebMvcLinkBuilder.methodOn;

@Component
public class BookAssembler implements SimpleRepresentationModelAssembler<BookResponse> {

    @Override
    public void addLinks(EntityModel<BookResponse> resource) {
        var id = resource.getContent().getId();

       var selfLink = linkTo(methodOn(BookRestController.class).findById(id))
           .withSelfRel()
           .withType("GET");
    
    // TEMP ~~ UNTIL PROGRAM THOSE METHODS ON RESTCONTROLLER
    //    var updateLink = linkTo(methodOn(BookRestController.class).update(null, id))
    //        .withRel("update")
    //        .withType("PUT");

    //    var deleteLink = linkTo(methodOn(BookRestController.class).delete(id))
    //        .withRel("delete")
    //        .withType("DELETE");


       resource.add(selfLink
        // ,updateLink, deleteLink
    );
    }

    @Override
    public void addLinks(CollectionModel<EntityModel<BookResponse>> resources) {
        var selfLink = linkTo(methodOn(BookRestController.class).findAll(null))
            .withSelfRel()
            .withType("GET");
        
        // TEMP ~~ UNTIL PROGRAM THOSE METHODS ON RESTCONTROLLER
        // Link createLink = null;
        // try {
        //     createLink = linkTo(methodOn(BookRestController.class).create(null, null))
        //         .withRel("create")
        //         .withType("POST");
        // } catch (JsonProcessingException e) {
        //     throw new RuntimeException(e);
        // }

        resources.add(selfLink
            // , createLink
        );
    }

}

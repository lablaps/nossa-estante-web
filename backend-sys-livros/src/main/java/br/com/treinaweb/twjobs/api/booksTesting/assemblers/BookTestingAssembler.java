package br.com.treinaweb.twjobs.api.booksTesting.assemblers;//package br.com.treinaweb.twjobs.api.ships.assemblers;

import br.com.treinaweb.twjobs.api.booksTesting.controllers.BookTestingRestController;
import br.com.treinaweb.twjobs.api.booksTesting.dtos.BookTestingResponse;
import org.springframework.hateoas.CollectionModel;
import org.springframework.hateoas.EntityModel;
import org.springframework.hateoas.server.SimpleRepresentationModelAssembler;
import org.springframework.stereotype.Component;

import static org.springframework.hateoas.server.mvc.WebMvcLinkBuilder.linkTo;
import static org.springframework.hateoas.server.mvc.WebMvcLinkBuilder.methodOn;

@Component
public class BookTestingAssembler implements SimpleRepresentationModelAssembler<BookTestingResponse> {

    @Override
    public void addLinks(EntityModel<BookTestingResponse> resource) {
        var id = resource.getContent().getId();

//        var selfLink = linkTo(methodOn(BookRestController.class).findById(id))
//            .withSelfRel()
//            .withType("GET");
//
//        var updateLink = linkTo(methodOn(BookRestController.class).update(null, id))
//            .withRel("update")
//            .withType("PUT");
//
//        var deleteLink = linkTo(methodOn(BookRestController.class).delete(id))
//            .withRel("delete")
//            .withType("DELETE");


//        resource.add(selfLink, updateLink, deleteLink);
    }

    @Override
    public void addLinks(CollectionModel<EntityModel<BookTestingResponse>> resources) {
        // var selfLink = linkTo(methodOn(BookTestingRestController.class).findAll(null))
        //     .withSelfRel()
        //     .withType("GET");

//        var createLink = linkTo(methodOn(BookRestController.class).create(null))
//            .withRel("create")
//            .withType("POST");

//         resources.add(selfLink
// //                , createLink
//         );
    }

}

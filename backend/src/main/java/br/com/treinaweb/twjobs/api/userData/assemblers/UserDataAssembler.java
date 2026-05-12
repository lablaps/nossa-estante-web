package br.com.treinaweb.twjobs.api.userData.assemblers;//package br.com.treinaweb.twjobs.api.ships.assemblers;

import br.com.treinaweb.twjobs.api.userData.controllers.UserDataRestController;
import br.com.treinaweb.twjobs.api.userData.dtos.UserDataResponse;

import org.springframework.hateoas.CollectionModel;
import org.springframework.hateoas.EntityModel;
import org.springframework.hateoas.server.SimpleRepresentationModelAssembler;
import org.springframework.stereotype.Component;

import static org.springframework.hateoas.server.mvc.WebMvcLinkBuilder.linkTo;
import static org.springframework.hateoas.server.mvc.WebMvcLinkBuilder.methodOn;

@Component
public class UserDataAssembler implements SimpleRepresentationModelAssembler<UserDataResponse> {

    @Override
    public void addLinks(EntityModel<UserDataResponse> resource) {
        var id = resource.getContent().getId();

        // var selfLink = linkTo(methodOn(UserDataRestController.class).findById(id))
        //         .withSelfRel()
        //         .withType("GET");

        // FUTURO
        // var updateLink = linkTo(methodOn(UserDataRestController.class).update(null, id))
        //        .withRel("update")
        //        .withType("PUT");

        // var deleteLink = linkTo(methodOn(UserDataRestController.class).delete(id))
        //        .withRel("delete")
        //        .withType("DELETE");

        // resource.add(selfLink
        //         // , updateLink, deleteLink
        // );
    }

    @Override
    public void addLinks(CollectionModel<EntityModel<UserDataResponse>> resources) {

        // var selfLink = linkTo(methodOn(UserDataRestController.class).findAll(null))
        //         .withSelfRel()
        //         .withType("GET");

        // FUTURO
        // var createLink = linkTo(methodOn(UserDataRestController.class).create(null, null))
        //        .withRel("create")
        //        .withType("POST");

        // resources.add(selfLink
        //         // , createLink
        // );
    }
}

package br.com.treinaweb.twjobs.api.exchanges.assemblers;

import br.com.treinaweb.twjobs.api.exchanges.controllers.ExchangeRestController;
import br.com.treinaweb.twjobs.api.exchanges.dtos.ExchangeResponse;
import org.springframework.hateoas.CollectionModel;
import org.springframework.hateoas.EntityModel;
import org.springframework.hateoas.server.SimpleRepresentationModelAssembler;
import org.springframework.stereotype.Component;

import com.fasterxml.jackson.core.JsonProcessingException;

import static org.springframework.hateoas.server.mvc.WebMvcLinkBuilder.linkTo;
import static org.springframework.hateoas.server.mvc.WebMvcLinkBuilder.methodOn;

@Component
public class ExchangeAssembler implements SimpleRepresentationModelAssembler<ExchangeResponse> {

    @Override
    public void addLinks(EntityModel<ExchangeResponse> resource) {
        var id = resource.getContent().getId();

        var selfLink = linkTo(methodOn(ExchangeRestController.class).findById(id))
            .withSelfRel()
            .withType("GET");

        // TEMP ~~ UNTIL PROGRAM THOSE METHODS ON RESTCONTROLLER
        // var updateLink = linkTo(methodOn(ExchangeRestController.class).update(null, id))
        //     .withRel("update")
        //     .withType("PUT");

        // var deleteLink = linkTo(methodOn(ExchangeRestController.class).delete(id))
        //     .withRel("delete")
        //     .withType("DELETE");

        resource.add(selfLink
            // , updateLink, deleteLink
        );
    }

    @Override
    public void addLinks(CollectionModel<EntityModel<ExchangeResponse>> resources) {
        var selfLink = linkTo(methodOn(ExchangeRestController.class).findAll(null))
            .withSelfRel()
            .withType("GET");

        // TEMP ~~ UNTIL PROGRAM THOSE METHODS ON RESTCONTROLLER
        // Link createLink = null;
        // try {
        //     createLink = linkTo(methodOn(ExchangeRestController.class).create(null, null))
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
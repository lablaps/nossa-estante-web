package br.com.treinaweb.twjobs.api.users.assemblers;

import org.springframework.hateoas.CollectionModel;
import org.springframework.hateoas.EntityModel;
import org.springframework.hateoas.server.SimpleRepresentationModelAssembler;
import org.springframework.stereotype.Component;

import br.com.treinaweb.twjobs.api.users.dtos.UserResponse;

@Component
public class UserAssembler implements SimpleRepresentationModelAssembler<UserResponse> {

    @Override
    public void addLinks(EntityModel<UserResponse> resource) {
        // HATEOAS disabled for the local monolith API.
    }

    @Override
    public void addLinks(CollectionModel<EntityModel<UserResponse>> resources) {
        // HATEOAS disabled for the local monolith API.
    }
}

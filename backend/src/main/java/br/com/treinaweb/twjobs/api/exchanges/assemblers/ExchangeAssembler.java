package br.com.treinaweb.twjobs.api.exchanges.assemblers;

import org.springframework.hateoas.CollectionModel;
import org.springframework.hateoas.EntityModel;
import org.springframework.hateoas.server.SimpleRepresentationModelAssembler;
import org.springframework.stereotype.Component;

import br.com.treinaweb.twjobs.api.exchanges.dtos.ExchangeResponse;

@Component
public class ExchangeAssembler implements SimpleRepresentationModelAssembler<ExchangeResponse> {

    @Override
    public void addLinks(EntityModel<ExchangeResponse> resource) {
        // HATEOAS disabled for the local monolith API.
    }

    @Override
    public void addLinks(CollectionModel<EntityModel<ExchangeResponse>> resources) {
        // HATEOAS disabled for the local monolith API.
    }
}

package br.com.treinaweb.twjobs.api.exchanges.mappers;


import br.com.treinaweb.twjobs.api.exchanges.dtos.ExchangeRequest;
import br.com.treinaweb.twjobs.api.exchanges.dtos.ExchangeResponse;
import br.com.treinaweb.twjobs.core.models.Exchange;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class ModelMapperExchangeMapper implements ExchangeMapper {

    private final ModelMapper modelMapper;

    @Override
    public ExchangeResponse toExchangeResponse(Exchange exchange) {
        return modelMapper.map(exchange, ExchangeResponse.class);
    }

    @Override
    public Exchange toExchange(@Valid ExchangeRequest exchangeRequest) {
        return modelMapper.map(exchangeRequest, Exchange.class);
    }

}


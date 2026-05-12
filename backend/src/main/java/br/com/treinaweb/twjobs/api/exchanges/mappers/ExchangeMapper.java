package br.com.treinaweb.twjobs.api.exchanges.mappers;//package br.com.treinaweb.twjobs.api.ships.mappers;

import br.com.treinaweb.twjobs.api.exchanges.dtos.ExchangeRequest;
import br.com.treinaweb.twjobs.api.exchanges.dtos.ExchangeResponse;
import br.com.treinaweb.twjobs.core.models.Exchange;

public interface ExchangeMapper {

    Exchange toExchange(ExchangeRequest exchangeRequest);

    ExchangeResponse toExchangeResponse(Exchange exchange);

}

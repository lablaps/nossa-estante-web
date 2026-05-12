package br.com.treinaweb.twjobs.api.exchanges.controllers;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;

import br.com.treinaweb.twjobs.api.exchanges.dtos.ExchangeRequest;
import br.com.treinaweb.twjobs.api.exchanges.dtos.ExchangeResponse;
import br.com.treinaweb.twjobs.core.exceptions.ModelNotFoundException;
import br.com.treinaweb.twjobs.core.models.Exchange;
import br.com.treinaweb.twjobs.core.repositories.BookRepository;
import br.com.treinaweb.twjobs.core.repositories.ExchangeRepository;
import br.com.treinaweb.twjobs.core.services.auth.SecurityService;
import lombok.RequiredArgsConstructor;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/exchanges")
public class ExchangeRestController {

    private final ExchangeRepository exchangeRepository;
    private final BookRepository bookRepository;
    private final SecurityService securityService;

    @GetMapping
    public List<ExchangeResponse> findAll() {
        var currentUser = securityService.getCurrentUser();
        return exchangeRepository.findAllByParticipantId(currentUser.getId())
                .stream()
                .map(this::toExchangeResponse)
                .toList();
    }

    @PostMapping
    @ResponseStatus(code = HttpStatus.CREATED)
    public ExchangeResponse create(@RequestBody ExchangeRequest exchangeRequest) {
        var currentUser = securityService.getCurrentUser();
        var book = bookRepository.findById(exchangeRequest.getBookId())
                .orElseThrow(() -> new ModelNotFoundException("Livro nao encontrado para troca."));

        if (book.getUser() == null) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Livro sem proprietario cadastrado.");
        }

        if (book.getUser().getId().equals(currentUser.getId())) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Voce nao pode solicitar troca do seu proprio livro.");
        }

        var exchange = Exchange.builder()
                .book(book)
                .fromUser(currentUser)
                .toUser(book.getUser())
                .status("OPEN")
                .meetingPoint(
                        exchangeRequest.getMeetingPoint() == null || exchangeRequest.getMeetingPoint().isBlank()
                                ? "A combinar"
                                : exchangeRequest.getMeetingPoint()
                )
                .build();

        book.setStatus("In Exchange");
        bookRepository.save(book);

        return toExchangeResponse(exchangeRepository.save(exchange));
    }

    private ExchangeResponse toExchangeResponse(Exchange exchange) {
        return ExchangeResponse.builder()
                .id(exchange.getId())
                .bookId(exchange.getBook().getId())
                .bookTitle(exchange.getBook().getTitle())
                .fromUserId(exchange.getFromUser().getId())
                .fromUserName(exchange.getFromUser().getName())
                .toUserId(exchange.getToUser().getId())
                .toUserName(exchange.getToUser().getName())
                .status(exchange.getStatus())
                .meetingPoint(exchange.getMeetingPoint())
                .build();
    }
}

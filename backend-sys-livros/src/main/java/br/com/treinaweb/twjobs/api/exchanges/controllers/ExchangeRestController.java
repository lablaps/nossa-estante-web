package br.com.treinaweb.twjobs.api.exchanges.controllers;

import br.com.treinaweb.twjobs.api.exchanges.assemblers.ExchangeAssembler;
import br.com.treinaweb.twjobs.api.exchanges.dtos.ExchangeRequest;
import br.com.treinaweb.twjobs.api.exchanges.dtos.ExchangeResponse;
import br.com.treinaweb.twjobs.api.exchanges.mappers.ExchangeMapper;
import br.com.treinaweb.twjobs.core.models.*;
import br.com.treinaweb.twjobs.core.permissions.TWJobsPermissions;
import br.com.treinaweb.twjobs.core.repositories.BookRepository;
import br.com.treinaweb.twjobs.core.repositories.ExchangeRepository;
import br.com.treinaweb.twjobs.core.repositories.UserRepository;
import br.com.treinaweb.twjobs.core.services.auth.SecurityService;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;

import java.util.Optional;

import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.data.web.PagedResourcesAssembler;
import org.springframework.hateoas.CollectionModel;
import org.springframework.hateoas.EntityModel;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/exchanges")
public class ExchangeRestController {

    private final ExchangeRepository exchangeRepository;
    private final ExchangeAssembler exchangeAssembler;
    private final ExchangeMapper exchangeMapper;
    private final SecurityService securityService;

    private final UserRepository userRepository;
    private final BookRepository bookRepository;

    @Autowired
    private ObjectMapper mapper;

    @Autowired
    private final Disco disco;

    private final PagedResourcesAssembler<ExchangeResponse> pagedResourcesAssembler;

    @GetMapping
    @TWJobsPermissions.IsAdmin
    public CollectionModel<EntityModel<ExchangeResponse>> findAll(@PageableDefault(value = 7) Pageable pageable) {
        Page<ExchangeResponse> exchanges = exchangeRepository.findAll(pageable)
                .map(exchangeMapper::toExchangeResponse);

        return pagedResourcesAssembler.toModel(exchanges, exchangeAssembler);
    }

    @GetMapping("/user")
    @TWJobsPermissions.IsAdmin
    public CollectionModel<EntityModel<ExchangeResponse>> findAllByUserId(@PageableDefault(value = 7) Pageable pageable) {
        User user = securityService.getCurrentUser();
        Long userId = user.getId();

        Page<ExchangeResponse> exchanges = exchangeRepository
                .findAll(pageable)
                .map(exchangeMapper::toExchangeResponse);

        return pagedResourcesAssembler.toModel(exchanges, exchangeAssembler);
    }

    @GetMapping("/{id}")
    @TWJobsPermissions.IsAdmin
    public EntityModel<ExchangeResponse> findById(@PathVariable Long id) {

        User user = securityService.getCurrentUser();
        Long userId = user.getId();

        var exchange = exchangeRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Exchange not found"));

        var exchangeResponse = exchangeMapper.toExchangeResponse(exchange);
        return exchangeAssembler.toModel(exchangeResponse);
    }

    @PostMapping
    @ResponseStatus(code = HttpStatus.CREATED)
    public EntityModel<ExchangeResponse> create(@RequestBody ExchangeRequest exchangeRequest) {
        

        var exchange = exchangeMapper.toExchange(exchangeRequest);
        // Exchange exchange = new Exchange();

        // exchange.setBook(bookRepository.findById(exchangeRequest.getBook_id()).orElseThrow(null));
        exchange.setTo_user(userRepository.findById(exchangeRequest.getTo_user()).orElseThrow(null));
        exchange.setFrom_user(securityService.getCurrentUser());

        // exchange.setBook_a(bookRepository.findById(exchangeRequest.getBook_a_id()).orElseThrow(null));
        exchange.setBook_b(bookRepository.findById(exchangeRequest.getBook_b_id()).orElseThrow(null));

        // Troca os donos dos livros e salva
        



        // Verify if all input data are correct
        System.out.println("********************"); 
        // System.out.println(bookRepository.findById(exchangeRequest.getBook_id())); // It worked
        System.out.println(userRepository.findById(exchangeRequest.getTo_user())); 
        System.out.println(securityService.getCurrentUser().getId()); 
        // System.out.println(bookRepository.findById(exchangeRequest.getBook_a_id())); 
        System.out.println(bookRepository.findById(exchangeRequest.getBook_b_id())); 
    
        exchange = exchangeRepository.save(exchange);

        var exchangeResponse = exchangeMapper.toExchangeResponse(exchange);

        return exchangeAssembler.toModel(exchangeResponse);
    }

    @Value("${contato.disco.raiz}")
    private String raiz;

    @Value("${contato.disco.diretorio-fotos}")
    private String diretorioFotos;

    // Updata - tanto "a" quanto "b" poderão editar o Exchange. Quando "status_a" e "status_b" são 1
    // então o "status_total" será atribuído como 1 e haverá a troca de usuários para os livros

    @PutMapping("/{id}")
    @TWJobsPermissions.IsAdmin
    // @TWJobsPermissions.IsCompany
    public EntityModel<ExchangeResponse> update(@PathVariable Long id, @RequestBody ExchangeRequest exchangeRequest) {

        //
        //    Inicialmente fazer uma diferenciação entre usuário "a" e "b"
        //


        var exchange = exchangeRepository.findById(id)
         .orElseThrow(RuntimeException::new);

        var exchangeData = exchangeMapper.toExchange(exchangeRequest);
        BeanUtils.copyProperties(exchangeData, exchange, "id", "book", "to_user", "from_user", "status_total");
        
        Book book_a = bookRepository.findById(exchangeRequest.getBook_a_id()).orElseThrow(null);
        Book book_b = bookRepository.findById(exchangeRequest.getBook_b_id()).orElseThrow(null);

        exchange.setBook_a(book_a);
        exchange.setBook_b(book_b);

        if(exchange.getStatus_a() && exchange.getStatus_b()) {

            book_a.setUser(exchange.getTo_user());
            bookRepository.save(book_a);

            book_b.setUser(exchange.getFrom_user());
            bookRepository.save(book_b);
            
            exchange.setStatus_total(true);
        }

        exchange = exchangeRepository.save(exchange);

        var exchangeResponse = exchangeMapper.toExchangeResponse(exchange);
        return exchangeAssembler.toModel(exchangeResponse);

    }

}







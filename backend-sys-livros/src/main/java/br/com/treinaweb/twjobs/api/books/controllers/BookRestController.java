package br.com.treinaweb.twjobs.api.books.controllers;

//import br.com.treinaweb.twjobs.api.ships.assemblers.SkillAssembler;
import br.com.treinaweb.twjobs.api.books.assemblers.BookAssembler;
import br.com.treinaweb.twjobs.api.books.dtos.BookRequest;
import br.com.treinaweb.twjobs.api.books.dtos.BookResponse;
import br.com.treinaweb.twjobs.api.books.mappers.BookMapper;
import br.com.treinaweb.twjobs.core.exceptions.NegocioException;
import br.com.treinaweb.twjobs.core.models.*;
import br.com.treinaweb.twjobs.core.permissions.TWJobsPermissions;
import br.com.treinaweb.twjobs.core.repositories.BookRepository;
import br.com.treinaweb.twjobs.core.services.auth.SecurityService;
import br.com.treinaweb.twjobs.core.services.jwt.JjwtJwtService;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.JsonSerializer;
import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.apache.catalina.mapper.Mapper;
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
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.time.LocalDate;
import java.util.List;



@RestController
@RequiredArgsConstructor
@RequestMapping("/api/books")
public class BookRestController {

    private final BookRepository bookRepository;
    private final BookAssembler bookAssembler;
    private final BookMapper bookMapper;
    private final SecurityService securityService;
    
    
    @Autowired
    private ObjectMapper mapper;

    @Autowired
    private final Disco disco;

    
    private final PagedResourcesAssembler<BookResponse> pagedResourcesAssembler;



    @GetMapping
    @TWJobsPermissions.IsAdmin
    public CollectionModel<EntityModel<BookResponse>> findAll(@PageableDefault(value = 7) Pageable pageable) {
            Page<BookResponse>
                    books = bookRepository.findAll(pageable)
                    .map(bookMapper::toBookResponse);
            return pagedResourcesAssembler.toModel(books, bookAssembler);
    }

    @GetMapping("/user")
    @TWJobsPermissions.IsAdmin
    public CollectionModel<EntityModel<BookResponse>> findAllByUserId(@PageableDefault(value = 7) Pageable pageable) {
        User user = securityService.getCurrentUser();
        Long userId = user.getId();
        
        Page<BookResponse>
                books = bookRepository.findAllByUserId(pageable,userId)
                .map(bookMapper::toBookResponse);

        return pagedResourcesAssembler.toModel(books, bookAssembler);
    }



    @GetMapping("/{id}")
    @TWJobsPermissions.IsAdmin
    public EntityModel<BookResponse> findById(@PathVariable Long id) {

        User user = securityService.getCurrentUser();
        Long userId = user.getId();

        var book = bookRepository.findByIdAndUserId(id, userId)
                .orElseThrow(null);


        var vesselResponse = bookMapper.toBookResponse(book);
        return bookAssembler.toModel(vesselResponse);
    }



    @PostMapping
    @ResponseStatus(code = HttpStatus.CREATED)    
    public EntityModel<BookResponse> create(@RequestBody BookRequest bookRequest) {

        var book = bookMapper.toBook(bookRequest);

        book.setUser(securityService.getCurrentUser());
        book.setData(null);

        book = bookRepository.save(book);

        var bookResponse = bookMapper.toBookResponse(book);
        
        return bookAssembler.toModel(bookResponse);
    }


    @Value("${contato.disco.raiz}")
    private String raiz;

    @Value("${contato.disco.diretorio-fotos}")
    private String diretorioFotos;

//    @PostMapping
//    @ResponseStatus(code = HttpStatus.CREATED)
//    public EntityModel<BookResponse> createBook( @Valid @RequestParam(name="bookRequest", required = true) String bookRequestForm, @Valid @RequestParam(name="foto", required = false) List<MultipartFile> foto) throws JsonProcessingException {
//        List<String> originalfilename = null;
//        for(MultipartFile i : foto) {
//
//            originalfilename.add(i.getOriginalFilename());
//
//        }
////        List<String> originalfilename = foto.getOriginalFilename();
//
////        for(String i : )
////        disco.salvarFoto(foto, securityService.getCurrentUser(), originalfilename.substring(originalfilename.lastIndexOf("/")+1));
//
//        BookRequest bookRequest = mapper.readValue(bookRequestForm, BookRequest.class);
//
//        var book = bookMapper.toBook(bookRequest);
//
//
//        String barra = "\\";
//
//        book.setImageUrls(raiz+barra+diretorioFotos+barra+securityService.getCurrentUser().getId()+"--"+String.valueOf(LocalDate.now())+"."+foto.getContentType());
//
//        book.setUser(securityService.getCurrentUser());
//        book = bookRepository.save(book);
//        var jobResponse = bookMapper.toBookResponse(book);
//        return bookAssembler.toModel(jobResponse);
//    }


//    @PutMapping("/{id}")
//    @TWJobsPermissions.IsOwner
//    public EntityModel<BookResponse> update(
//            @RequestBody @Valid BookRequest bookRequest,
//            @PathVariable Long id
//    ) {
                    
//    }

//    @DeleteMapping("/{id}")
////    @TWJobsPermissions.IsOwner
//    public ResponseEntity<?> delete(@PathVariable Long id) {
//
//    }
//
}
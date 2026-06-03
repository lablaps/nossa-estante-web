package br.com.treinaweb.twjobs.api.catalogo;

import org.springframework.data.domain.Pageable;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.data.domain.Page;
import org.springframework.data.web.PageableDefault;
import org.springframework.data.web.PagedResourcesAssembler;
import org.springframework.hateoas.CollectionModel;
import org.springframework.hateoas.EntityModel;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import br.com.treinaweb.twjobs.api.books.assemblers.BookAssembler;
import br.com.treinaweb.twjobs.api.books.dtos.BookResponse;
import br.com.treinaweb.twjobs.api.books.mappers.BookMapper;
import br.com.treinaweb.twjobs.core.models.Book;
import br.com.treinaweb.twjobs.core.permissions.TWJobsPermissions;
import br.com.treinaweb.twjobs.core.repositories.BookCustomRepository;
import br.com.treinaweb.twjobs.core.repositories.BookRepository;
import lombok.RequiredArgsConstructor;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/catalogo")
public class CatalogoRestControler {


    private final BookRepository bookRepository;

    private final BookMapper bookMapper;

    private final BookAssembler bookAssembler;

    private final PagedResourcesAssembler<BookResponse> pagedResourcesAssembler;

    private final BookCustomRepository bookCustomRepository;

    @GetMapping("/books")
    public CollectionModel<EntityModel<BookResponse>> findAll(@PageableDefault(value = 7) Pageable pageable) {
            Page<BookResponse>
                    books = bookRepository.findAllByOrderByIdDesc(pageable)
                    .map(bookMapper::toBookResponse);
            return pagedResourcesAssembler.toModel(books, bookAssembler);
    }

    @GetMapping("/books/{id}")
    public EntityModel<BookResponse> findById(@PathVariable Long id) {

        var book = bookRepository.findById(id)
                .orElseThrow(null);

        var vesselResponse = bookMapper.toBookResponse(book);
        return bookAssembler.toModel(vesselResponse);
    }
    
    @GetMapping("/books/filters")
    public List<BookResponse> customSearchingCatalogo(@RequestParam(value="id", required=false) Long id, @RequestParam(value="gender", required=false) String gender) {


            List<BookResponse> books = bookCustomRepository.booksCustom(id, gender)
                    .stream()
                    .map(bookMapper::toBookResponse)
                    .collect(Collectors.toList());

            return books;
           
    }

    
}

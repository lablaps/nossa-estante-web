package br.com.treinaweb.twjobs.api.books.controllers;

import java.math.BigDecimal;
import java.util.Date;
import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

import br.com.treinaweb.twjobs.api.books.dtos.BookRequest;
import br.com.treinaweb.twjobs.api.books.dtos.BookResponse;
import br.com.treinaweb.twjobs.core.exceptions.ModelNotFoundException;
import br.com.treinaweb.twjobs.core.models.Book;
import br.com.treinaweb.twjobs.core.repositories.BookRepository;
import br.com.treinaweb.twjobs.core.services.auth.SecurityService;
import lombok.RequiredArgsConstructor;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/books")
public class BookRestController {

    private final BookRepository bookRepository;
    private final SecurityService securityService;

    @GetMapping
    public List<BookResponse> findAll() {
        return bookRepository.findAllByOrderByIdDesc()
                .stream()
                .map(this::toBookResponse)
                .toList();
    }

    @GetMapping("/user")
    public List<BookResponse> findAllByUserId() {
        var currentUser = securityService.getCurrentUser();
        return bookRepository.findAllByUserIdOrderByIdDesc(currentUser.getId())
                .stream()
                .map(this::toBookResponse)
                .toList();
    }

    @GetMapping("/{id}")
    public BookResponse findById(@PathVariable Long id) {
        return bookRepository.findById(id)
                .map(this::toBookResponse)
                .orElseThrow(() -> new ModelNotFoundException("Livro nao encontrado."));
    }

    @PostMapping
    @ResponseStatus(code = HttpStatus.CREATED)
    public BookResponse create(@RequestBody BookRequest bookRequest) {
        var currentUser = securityService.getCurrentUser();

        var book = Book.builder()
                .user(currentUser)
                .title(bookRequest.getTitle())
                .author(bookRequest.getAuthor())
                .coverURL(bookRequest.getCoverURL())
                .synopses(bookRequest.getSynopses())
                .pageCount(bookRequest.getPageCount() <= 0 ? null : bookRequest.getPageCount())
                .publisher(bookRequest.getPublisher())
                .publishedDate(bookRequest.getPublishedDate())
                .isbn10(bookRequest.getIsbn10())
                .isbn13(bookRequest.getIsbn13())
                .language(bookRequest.getLanguage())
                .edition(bookRequest.getEdition())
                .material_state(bookRequest.getMaterial_state())
                .physicalFormat(bookRequest.getPhysicalFormat())
                .publishPlace(bookRequest.getPublishPlace())
                .status(bookRequest.getStatus() == null || bookRequest.getStatus().isBlank() ? "Available" : bookRequest.getStatus())
                .cost(bookRequest.getCost() == null ? BigDecimal.ZERO : bookRequest.getCost())
                .gender(bookRequest.getGender())
                .contributors(bookRequest.getContributors())
                .data(new Date())
                .build();

        return toBookResponse(bookRepository.save(book));
    }

    private BookResponse toBookResponse(Book book) {
        return BookResponse.builder()
                .id(book.getId())
                .userId(book.getUser() == null ? null : book.getUser().getId())
                .ownerName(book.getUser() == null ? null : book.getUser().getName())
                .title(book.getTitle())
                .author(book.getAuthor())
                .coverURL(book.getCoverURL())
                .synopses(book.getSynopses())
                .pageCount(book.getPageCount())
                .publisher(book.getPublisher())
                .publishedDate(book.getPublishedDate())
                .isbn10(book.getIsbn10())
                .isbn13(book.getIsbn13())
                .language(book.getLanguage())
                .edition(book.getEdition())
                .material_state(book.getMaterial_state())
                .physicalFormat(book.getPhysicalFormat())
                .publishPlace(book.getPublishPlace())
                .status(book.getStatus())
                .cost(book.getCost())
                .gender(book.getGender())
                .contributors(book.getContributors())
                .build();
    }
}

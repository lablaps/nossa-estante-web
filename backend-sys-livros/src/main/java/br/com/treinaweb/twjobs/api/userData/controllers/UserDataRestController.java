package br.com.treinaweb.twjobs.api.userData.controllers;

//import br.com.treinaweb.twjobs.api.ships.assemblers.SkillAssembler;
import br.com.treinaweb.twjobs.api.books.assemblers.BookAssembler;
import br.com.treinaweb.twjobs.api.books.dtos.BookRequest;
import br.com.treinaweb.twjobs.api.books.dtos.BookResponse;
import br.com.treinaweb.twjobs.api.books.mappers.BookMapper;
import br.com.treinaweb.twjobs.api.userData.assemblers.UserDataAssembler;
import br.com.treinaweb.twjobs.api.userData.dtos.UserDataRequest;
import br.com.treinaweb.twjobs.api.userData.dtos.UserDataResponse;
import br.com.treinaweb.twjobs.api.userData.mappers.UserDataMapper;
import br.com.treinaweb.twjobs.core.exceptions.NegocioException;
import br.com.treinaweb.twjobs.core.models.*;
import br.com.treinaweb.twjobs.core.permissions.TWJobsPermissions;
import br.com.treinaweb.twjobs.core.repositories.BookRepository;
import br.com.treinaweb.twjobs.core.repositories.UserDataRepository;
import br.com.treinaweb.twjobs.core.services.auth.SecurityService;
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
import java.util.Optional;




@RestController
@RequiredArgsConstructor
@RequestMapping("/api/user-data")
public class UserDataRestController {

    private final UserDataRepository userDataRepository;
    private final UserDataAssembler userDataAssembler;
    private final UserDataMapper userDataMapper;
    private final SecurityService securityService;

    @Autowired
    private ObjectMapper mapper;

    @Autowired
    private final Disco disco;




    private final PagedResourcesAssembler<UserDataResponse> pagedResourcesAssembler;


    @PostMapping
    @ResponseStatus(code = HttpStatus.CREATED)    
    public EntityModel<UserDataResponse> create(@RequestBody UserDataRequest userDataRequest) {

        var userData = userDataMapper.toUserData(userDataRequest);

        userData.setUser(securityService.getCurrentUser());
        
        userData = userDataRepository.save(userData);

        var userDataResponse = userDataMapper.toUserDataResponse(userData);
        
        return userDataAssembler.toModel(userDataResponse);
    }

    @GetMapping("/id")
    public Long getIdUserDataByUser() {
        var user_section = securityService.getCurrentUser();
        System.out.println(user_section);
        Optional<UserData> user = userDataRepository.findByUserId(user_section.getId());
        System.out.println(user);
        return user.get().getId();
    }

    @PutMapping("/{id}")
    public EntityModel<UserDataResponse> update(
            @RequestBody UserDataRequest userDataRequest,
            @PathVariable Long id
    ) {
         var userSaved = userDataRepository.findById(id)
         .orElseThrow(RuntimeException::new);

         var userData = userDataMapper.toUserData(userDataRequest);
         BeanUtils.copyProperties(userData, userSaved, "id");
         
         userData = userDataRepository.save(userData);

         var userDataResponse = userDataMapper.toUserDataResponse(userData);

         return userDataAssembler.toModel(userDataResponse);
    }



//    """      Esse método retorna apenas os books do Usuário. role CANDIDATE pra cima.
//
//                  """
    // @GetMapping
    // public CollectionModel<EntityModel<BookResponse>> findAll(@PageableDefault(value = 7) Pageable pageable) {
    //     User user = securityService.getCurrentUser();
    //     Long userId = user.getId();


    //     Page<BookResponse>
    //             books = bookRepository.findAllByUserId(pageable,userId)
    //             .map(bookMapper::toBookResponse);

    //     return pagedResourcesAssembler.toModel(books, bookAssembler);
    // }




    //     @GetMapping("/{id}")
    // public EntityModel<AcceptResponse> findById(@PathVariable Long id) {
    //     User user = securityService.getCurrentUser();
    //     Long userId = user.getId();
    //     Accept accept;

    //     if(user.getRole()==Role.COMPANY) {
    //        accept = acceptRepository.findById(id)
    //                 .orElseThrow(AcceptNotFoundException::new);
    //     } else {
    //         accept = acceptRepository.findByIdAndUserId(id, userId)
    //                 .orElseThrow(AcceptNotFoundException::new);
    //     }


    //     var acceptResponse = acceptMapper.toAcceptResponse(accept);
    //     return acceptAssembler.toModel(acceptResponse);
    // }



//    """      Esse método retorna todos os Books. `apenas` role COMPANY
//
//                    """
    // @GetMapping("/admin")
    // @TWJobsPermissions.IsCompany
    // public CollectionModel<EntityModel<BookResponse>> admFindAll(@PageableDefault(value = 7) Pageable pageable) {

    //     Page<BookResponse>
    //             books = bookRepository.findAll(pageable)
    //             .map(bookMapper::toBookResponse);

    //     return pagedResourcesAssembler.toModel(books, bookAssembler);
    // }



//    """      Esse método um Book pelo Id. `apenas` role COMPANY
//
//                    """
    // @GetMapping("/{id}")
    // public EntityModel<BookResponse> findById(@PathVariable Long id) {

    //     User user = securityService.getCurrentUser();
    //     Long userId = user.getId();

    //     var book = bookRepository.findByIdAndUserId(id, userId)
    //             // .orElseThrow(VesselNotFoundException::new);
    //             .orElseThrow(null);


    //     var vesselResponse = bookMapper.toBookResponse(book);
    //     return bookAssembler.toModel(vesselResponse);
    // }



//    """      Esse método retorna um Book pelo Id. `apenas` role COMPANY
//
//                    """
    // @GetMapping("/admin/{id}")
    // @TWJobsPermissions.IsCompany
    // public EntityModel<BookResponse> admFindById(@PathVariable Long id) {

    //     var book = bookRepository.findById(id)
    //             .orElseThrow(VesselNotFoundException::new);



    //     var vesselResponse = bookMapper.toBookResponse(book);
    //     return bookAssembler.toModel(vesselResponse);
    // }



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
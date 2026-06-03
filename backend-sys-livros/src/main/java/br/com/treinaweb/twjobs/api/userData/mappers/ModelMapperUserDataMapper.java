package br.com.treinaweb.twjobs.api.userData.mappers;


import br.com.treinaweb.twjobs.api.books.dtos.BookRequest;
import br.com.treinaweb.twjobs.api.books.dtos.BookResponse;
import br.com.treinaweb.twjobs.api.userData.dtos.UserDataRequest;
import br.com.treinaweb.twjobs.api.userData.dtos.UserDataResponse;
import br.com.treinaweb.twjobs.core.models.Book;
import br.com.treinaweb.twjobs.core.models.UserData;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Component;


 
@Component
@RequiredArgsConstructor
public class ModelMapperUserDataMapper implements UserDataMapper {

    private final ModelMapper modelMapper;

    @Override
    public UserDataResponse toUserDataResponse(UserData userData) {
        return modelMapper.map(userData, UserDataResponse.class);
    }

    @Override
    public UserData toUserData(@Valid UserDataRequest userDataRequest) {
        return modelMapper.map(userDataRequest, UserData.class);
    }

}


package br.com.treinaweb.twjobs.api.userData.mappers;//package br.com.treinaweb.twjobs.api.ships.mappers;

import br.com.treinaweb.twjobs.api.userData.dtos.UserDataRequest;
import br.com.treinaweb.twjobs.api.userData.dtos.UserDataResponse;
import br.com.treinaweb.twjobs.core.models.UserData;



public interface UserDataMapper {
 

   UserData toUserData(UserDataRequest userDataRequest);

   UserDataResponse toUserDataResponse(UserData userData);

}

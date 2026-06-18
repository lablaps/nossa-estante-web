package br.com.treinaweb.twjobs.api.auth.controllers;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.BeanUtils;
import org.springframework.http.HttpStatus;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

import br.com.treinaweb.twjobs.api.auth.dtos.LoginRequest;
import br.com.treinaweb.twjobs.api.auth.dtos.RefreshRequest;
import br.com.treinaweb.twjobs.api.auth.dtos.TokenResponse;
import br.com.treinaweb.twjobs.api.auth.dtos.UserRequest;
import br.com.treinaweb.twjobs.api.auth.dtos.UserResponse;
import br.com.treinaweb.twjobs.api.auth.mappers.UserMapper;
import br.com.treinaweb.twjobs.core.enums.GeoType;
import br.com.treinaweb.twjobs.core.enums.Role;
import br.com.treinaweb.twjobs.core.models.Coordinates;
import br.com.treinaweb.twjobs.core.models.Geometry;
import br.com.treinaweb.twjobs.core.models.User;
import br.com.treinaweb.twjobs.core.repositories.CoordinatesRepository;
import br.com.treinaweb.twjobs.core.repositories.GeometryRepository;
import br.com.treinaweb.twjobs.core.repositories.UserRepository;
import br.com.treinaweb.twjobs.core.services.jwt.JjwtJwtService;
import br.com.treinaweb.twjobs.core.services.jwt.JwtService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/auth")
public class AuthRestController {

    private final UserMapper userMapper;
    private final JwtService jwtService;
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final AuthenticationManager authenticationManager;

    private final JjwtJwtService jjwtService;

    private final GeometryRepository geometryRepository;
    private final CoordinatesRepository coordinatesRepository;
    

    @PostMapping("/register")
    @ResponseStatus(code = HttpStatus.CREATED)
    public UserResponse register(@RequestBody @Valid UserRequest userRequest) {
        var user = userMapper.toUser(userRequest);
        var passwordHash = passwordEncoder.encode(user.getPassword());
        user.setPassword(passwordHash);
        user = userRepository.save(user);

     
        jjwtService.sendVerificationEmail(user);
        


        return userMapper.toUserResponse(user);
    }

    @PostMapping("/login")
    public TokenResponse login(@RequestBody @Valid LoginRequest loginRequest) {
        var user = userRepository.findByEmail(loginRequest.getEmail()).orElseThrow();
        
        BigDecimal latitude_response;
        BigDecimal longitude_response;
            // TEMP DISABLE - IMPORTANT CHANGE LATER
            // if(user.getRole() != Role.ADMIN && !user.getVerified()) {
            //             throw new RuntimeException("You must verify your account!");
            // }



        //                  Cadastra localização do usuário
        // """   
        //    Quando logar pela primeira vez a localização vai ser guardada
        //    Outra forma será a edição ou cadastro direto na endpoint de editar usuário
        //                                                                              """
        // System.out.println("*********************** User geoloc\n");
        // System.out.println(user.getGeometry());
        if(user.getGeometry()==null && loginRequest.getLatitude()!=null && loginRequest.getLongitude()!=null && loginRequest.getGeoType() != null) {

            // Coordenadas
            List<Coordinates> coordinatesList = new ArrayList<>();
            Coordinates testCoordinates = new Coordinates();
            testCoordinates.setLatitude(loginRequest.getLatitude());
            testCoordinates.setLongitude(loginRequest.getLongitude());
            coordinatesList.add(testCoordinates);
            
            // Grava coordenadas no banco de dados
            List<Coordinates> coordinatesList_ = coordinatesRepository.saveAll(coordinatesList);

            System.out.println(coordinatesList_);
            
            // Geometry
            Geometry geometry = new Geometry();
            geometry.setUser(user);
            geometry.setGeoType(loginRequest.getGeoType());
            geometry.setCoordinates(coordinatesList_);

            // Grava geometry no banco de dados
            Geometry geometry_ = geometryRepository.save(geometry);

            System.out.println(geometry_);

            var user_ = new User();

            user_.setGeometry(geometry_);

            System.out.println(user_);

            BeanUtils.copyProperties(user_, user, "id", "name", "email","password","role", "text", "verified", "passwordConfirmation", "roleDescription");


            userRepository.save(user);

            // Log armazenando localização
            System.out.println("******************\n");
            System.out.println("Localização do usuário armazenada\n");
        }



        var usernamePasswordAuthenticationToken = new UsernamePasswordAuthenticationToken(
                loginRequest.getEmail(),
                loginRequest.getPassword()
        );
        authenticationManager.authenticate(usernamePasswordAuthenticationToken);
        return TokenResponse.builder()
                .accessToken(jwtService.generateAccessToken(loginRequest.getEmail(), user.getRole()))
                .refreshToken(jwtService.generateRefreshToken(loginRequest.getEmail(), user.getRole()))
                .latitude(String.valueOf(user.getGeometry().getCoordinates().get(0).getLatitude()))
                .longitude(String.valueOf(user.getGeometry().getCoordinates().get(0).getLongitude()))
                .build();
    }



    @GetMapping("/verify/{token}") 
    @ResponseStatus(code = HttpStatus.OK)
    public String verifyUser(@PathVariable String token) {

       return jjwtService.handleVerification(token);
            // return token;

    }

    @PostMapping("/refresh")
    public TokenResponse refresh(@RequestBody @Valid RefreshRequest refreshRequest) {
        var sub = jwtService.getSubFromRefreshToken(refreshRequest.getRefreshToken());
        var user = userRepository.findByEmail(sub);
        return TokenResponse.builder()
                .accessToken(jwtService.generateAccessToken(sub, user.get().getRole()))
                .refreshToken(jwtService.generateRefreshToken(sub, user.get().getRole()))
                .build();
    }


}
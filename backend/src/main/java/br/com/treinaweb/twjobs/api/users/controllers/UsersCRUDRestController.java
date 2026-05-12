package br.com.treinaweb.twjobs.api.users.controllers;

import java.util.List;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import br.com.treinaweb.twjobs.api.users.dtos.UserRequest;
import br.com.treinaweb.twjobs.api.users.dtos.UserResponse;
import br.com.treinaweb.twjobs.core.models.User;
import br.com.treinaweb.twjobs.core.repositories.UserRepository;
import br.com.treinaweb.twjobs.core.services.auth.SecurityService;
import lombok.RequiredArgsConstructor;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/users")
public class UsersCRUDRestController {

    private final UserRepository userRepository;
    private final SecurityService securityService;

    @GetMapping
    public List<UserResponse> findAll() {
        return userRepository.findAll()
                .stream()
                .map(this::toUserResponse)
                .toList();
    }

    @GetMapping("/me")
    public UserResponse me() {
        return toUserResponse(securityService.getCurrentUser());
    }

    @PutMapping("/me")
    public UserResponse updateMe(@RequestBody UserRequest userRequest) {
        var currentUser = securityService.getCurrentUser();

        if (userRequest.getName() != null && !userRequest.getName().isBlank()) {
            currentUser.setName(userRequest.getName().trim());
        }

        return toUserResponse(userRepository.save(currentUser));
    }

    private UserResponse toUserResponse(User user) {
        return UserResponse.builder()
                .id(user.getId())
                .name(user.getName())
                .email(user.getEmail())
                .role(user.getRole())
                .build();
    }
}

package br.com.treinaweb.twjobs.core.services.jwt;

import br.com.treinaweb.twjobs.core.models.User;

public interface JwtService {

    String generateAccessToken(User user);

    String getSubFromAccessToken(String token);

    String generateRefreshToken(User user);

    String getSubFromRefreshToken(String token);
}

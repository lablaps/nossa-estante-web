package br.com.treinaweb.twjobs.core.services.jwt;

import java.time.Instant;
import java.util.Date;

import org.springframework.stereotype.Service;

import br.com.treinaweb.twjobs.config.JwtConfigProperties;
import br.com.treinaweb.twjobs.core.exceptions.JwtServiceException;
import br.com.treinaweb.twjobs.core.models.User;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.JwtException;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class JjwtJwtService implements JwtService {

    private final JwtConfigProperties configProperties;

    @Override
    public String generateAccessToken(User user) {
        return generateToken(
                user,
                configProperties.getAccessSecret(),
                configProperties.getAccessExpiresIn()
        );
    }

    @Override
    public String getSubFromAccessToken(String token) {
        return getSubFromToken(token, configProperties.getAccessSecret());
    }

    @Override
    public String generateRefreshToken(User user) {
        return generateToken(
                user,
                configProperties.getRefreshSecret(),
                configProperties.getRefreshExpiresIn()
        );
    }

    @Override
    public String getSubFromRefreshToken(String token) {
        return getSubFromToken(token, configProperties.getRefreshSecret());
    }

    private String generateToken(User user, String secret, Long expiresIn) {
        var now = Instant.now();
        var expiration = now.plusSeconds(expiresIn);
        var key = Keys.hmacShaKeyFor(secret.getBytes());
        return Jwts.builder()
                .subject(user.getEmail())
                .claim("id", user.getId())
                .claim("name", user.getName())
                .claim("email", user.getEmail())
                .claim("role", user.getRole().name())
                .issuedAt(Date.from(now))
                .expiration(Date.from(expiration))
                .signWith(key)
                .compact();
    }

    private String getSubFromToken(String token, String secret) {
        var key = Keys.hmacShaKeyFor(secret.getBytes());
        try {
            Claims claims = Jwts.parser()
                    .verifyWith(key)
                    .build()
                    .parseSignedClaims(token)
                    .getPayload();
            return claims.getSubject();
        } catch (JwtException e) {
            throw new JwtServiceException("Erro ao decodificar o token JWT: " + e.getMessage());
        }
    }
}

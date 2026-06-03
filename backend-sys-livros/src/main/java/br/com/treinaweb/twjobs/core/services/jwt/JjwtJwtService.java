package br.com.treinaweb.twjobs.core.services.jwt;

import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.time.Duration;
import java.time.Instant;
import java.util.Date;

import javax.crypto.SecretKey;

import br.com.treinaweb.twjobs.core.enums.Role;
import org.springframework.stereotype.Service;

import br.com.treinaweb.twjobs.config.JwtConfigProperties;
import br.com.treinaweb.twjobs.core.exceptions.JwtServiceException;
import br.com.treinaweb.twjobs.core.models.User;
import br.com.treinaweb.twjobs.core.repositories.UserRepository;
import br.com.treinaweb.twjobs.core.service.EmailService;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.ExpiredJwtException;
import io.jsonwebtoken.JwtException;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class JjwtJwtService implements JwtService {

    private final JwtConfigProperties configProperties;



    // New Part - 23pm - 08/04/2026

    private final EmailService emailService;
    
    private final UserRepository userRepository;

    public String createVerificationToken(Long userId) {


            Instant now = Instant.now();
            byte[] keyBytes = Decoders.BASE64.decode("b9048bb98d808d82bf7250333035db0ea7ada419a53153ec550fcf3dd6d51b13");

            SecretKey key = Keys.hmacShaKeyFor(keyBytes);

            return Jwts.builder()
                    .subject(String.valueOf(userId))
                    .issuedAt(Date.from(now))
                    .expiration(Date.from(now.plus(Duration.ofMinutes(15))))
                    .signWith(key, Jwts.SIG.HS256)
                    .compact();
    }

    public void sendVerificationEmail(User user) {

        String token = createVerificationToken(user.getId());
        String verifyUrl = "https://your-app.com/verify?token=" + URLEncoder.encode(token, StandardCharsets.UTF_8);

        String message = "Click below to verify your email:\n" + verifyUrl;
        
        emailService.enviarEmailTexto(user.getEmail(), "Verify your e-mail", message);

    }

    public String handleVerification(String token) {

        Claims claims;

        try {
            byte[] keyBytes = Decoders.BASE64.decode("b9048bb98d808d82bf7250333035db0ea7ada419a53153ec550fcf3dd6d51b13");
            SecretKey key = Keys.hmacShaKeyFor(keyBytes);

            claims = Jwts.parser()
                .verifyWith(key)
                .build()
                .parseSignedClaims(token)
                .getPayload();
        } catch (ExpiredJwtException e){
            throw new RuntimeException("This link has expired");
        } catch (JwtException e) {
            throw new RuntimeException("Invalid token!");
        }

        String userId = claims.getSubject();

        User user = userRepository.findById(Long.valueOf(userId)).orElseThrow();

        if(user.getVerified()) {
            return "E-mail already verified!";
        }
        

        user.setVerified(true);

        userRepository.save(user);

        return "E-mail verification successfull!";


    }

    // 


    @Override
    public String generateAccessToken(String sub, Role role) {
        return generateToken(
                sub,
                role,
                configProperties.getAccessSecret(),
                configProperties.getAccessExpiresIn()
        );
    }

    @Override
    public String getSubFromAccessToken(String token) {
        return getSubFromToken(token, configProperties.getAccessSecret());
    }

    @Override
    public String generateRefreshToken(String sub, Role role) {
        return generateToken(
                sub,
                role,
                configProperties.getRefreshSecret(),
                configProperties.getRefreshExpiresIn()
        );
    }

    @Override
    public String getSubFromRefreshToken(String token) {
        return getSubFromToken(token, configProperties.getRefreshSecret());
    }

    private String generateToken(String sub, Role role, String secret, Long expiresIn) {
        var now = Instant.now();
        var expiration = now.plusSeconds(expiresIn);
        var key = Keys.hmacShaKeyFor(secret.getBytes());
        return Jwts.builder()
                .subject(sub)
                // DEPRECATED
                // .setSubject(sub)
                .claim("role", role.name()) // Adicionando a role ao claim do token
                .issuedAt(Date.from(now))
                // DEPRECATED
                // .setIssuedAt(Date.from(now))
                // DEPRECATED
                // .setExpiration(Date.from(expiration))
                .expiration(Date.from(expiration))
                .signWith(key)
                .compact();
    }
    
    // LINK FOR FIX DEPRECATED
    // https://stackoverflow.com/questions/73576686/what-substitute-can-i-use-for-java-springs-jwts-signwith-deprecated-method
    // At the codes that are deprecated if you put your mouse above it, you will see an warning explainning how to substitute the code by the new one. So you don't need the link you don't want to.


    private String getSubFromToken(String token, String secret) {
        var key = Keys.hmacShaKeyFor(secret.getBytes());
        try {
            Claims claims = Jwts.parser()
                    .verifyWith(key)
                    // DEPRECATED
                    // .setSigningKey(key)
                    .build()
                    // DEPRECATED
                    // .parseClaimsJws(token)
                    .parseSignedClaims(token)
                    .getPayload();
                    // DEPRECATED
                    // .getBody();
            return claims.getSubject();
        } catch (JwtException e) {
            throw new JwtServiceException("Erro ao decodificar o token JWT: " + e.getMessage());
        }
    }
}
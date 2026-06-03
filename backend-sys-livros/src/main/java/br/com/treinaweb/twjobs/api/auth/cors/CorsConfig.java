package br.com.treinaweb.twjobs.api.auth.cors;


import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class CorsConfig implements WebMvcConfigurer {

    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/**")
                // .allowedOrigins("http://localhost:3000")
                .allowedOrigins("https://nossa-estante-web.vercel.app", "http://127.0.0.1:*", "http://localhost:3000")
                .allowedMethods("GET", "POST", "DELETE", "PUT");
    }
}
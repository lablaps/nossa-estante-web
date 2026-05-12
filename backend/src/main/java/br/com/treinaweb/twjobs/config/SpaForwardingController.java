package br.com.treinaweb.twjobs.config;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class SpaForwardingController {

    @GetMapping({
            "/",
            "/intro",
            "/login",
            "/signup",
            "/home",
            "/explore",
            "/minha-estante",
            "/cadastrar-livro",
            "/meu-perfil",
            "/livro/{id}"
    })
    public String forwardToIndex() {
        return "forward:/index.html";
    }
}

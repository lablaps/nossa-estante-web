package br.com.treinaweb.twjobs;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.core.annotation.Order;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import br.com.treinaweb.twjobs.core.enums.Role;
import br.com.treinaweb.twjobs.core.models.User;
import br.com.treinaweb.twjobs.core.repositories.UserRepository;
import lombok.RequiredArgsConstructor;

@Component
@Order(1)
@RequiredArgsConstructor
public class MyCommandLineRunner implements CommandLineRunner {

   
    private final UserRepository userRepository;

    private final PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) throws Exception {
        System.out.println("Application started with command-line arguments: ");
        for (String arg : args) {
            System.out.println(arg);
        }
        
        if(userRepository.existsByEmail("anamaria@projlivros.local") == false) {
            User user = new User();
            user.setName("Anamaria Silva");
            user.setEmail("anamaria@projlivros.local");
            var passwordHash = passwordEncoder.encode("Projlivros@2026");
            user.setPassword(passwordHash);
            user.setRole(Role.ADMIN);
            user.setText("Administrador ativo da plataforma ProjLivros.");
            user.setVerified(true);

            userRepository.save(user);
        }

        if(userRepository.existsByEmail("userA.leitor@projlivros.local") == false) {
            User user = new User();
            user.setName("Carlos Eduardo Leitor");
            user.setEmail("userA.leitor@projlivros.local");
            var passwordHash = passwordEncoder.encode("ReaderAccess@2026");
            user.setPassword(passwordHash);
            user.setRole(Role.REGULAR);
            user.setText("Leitor ativo da plataforma ProjLivros.");
            user.setVerified(true);

            userRepository.save(user);
        }

        if(userRepository.existsByEmail("userB.leitor@projlivros.local") == false) {
            User user = new User();
            user.setName("Fernanda Alves Leitor");
            user.setEmail("userB.leitor@projlivros.local");
            var passwordHash = passwordEncoder.encode("BooksCommunity@2026");
            user.setPassword(passwordHash);
            user.setRole(Role.REGULAR);
            user.setText("Usuária participante da comunidade de troca de livros.");
            user.setVerified(true);

            userRepository.save(user);
        }

        // Cadastrando Livros

        // Cadastrando Trocas

        



    }
}

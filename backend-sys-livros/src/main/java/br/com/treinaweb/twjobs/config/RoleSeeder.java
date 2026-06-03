package br.com.treinaweb.twjobs.config;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.logging.Logger;

import org.hibernate.validator.internal.util.logging.LoggerFactory;
import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
import org.springframework.context.annotation.Configuration;
import org.springframework.stereotype.Component;

import br.com.treinaweb.twjobs.core.models.Roles;
import br.com.treinaweb.twjobs.core.repositories.RolesRepository;
import lombok.RequiredArgsConstructor;

// @Configuration
@Component
@RequiredArgsConstructor
public class RoleSeeder implements ApplicationRunner {
    private final RolesRepository roleRepository;
    
    // private static final Logger log = org.slf4j.LoggerFactory.getLogger(RoleSeeder.class);

    @Override
    public void run(ApplicationArguments args) throws Exception {
        if(args.getOptionValues("seeder") != null){
            List<String> seeder = Arrays.asList(args.getOptionValues("seeder").get(0).split(","));
            if(seeder.contains("role")) {
                seedRoles();
                // log.info("Success run role seeder");
            }
        }else{
            // log.info("Role seeder skipped");
        }
    }

    private void seedRoles(){
        List<String> roles = new ArrayList<>();

        roles.add("User");
        roles.add("Admin");
        roles.add("Superadmin");
        roles.add("Manager");

        var index = 0;
        for (var role : roles ) {
            // Roles Roles = Roles.builder()
            //         .role_name(role)
            //         .build();
            Roles role_ = new Roles();
            role_.setRole_name(role);

            this.roleRepository.save(role_);

            // log.info("Success run RoleSeeder {}",roles.get(index));

            index++;
        }
    }
}

package br.com.treinaweb.twjobs;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.jdbc.DataSourceAutoConfiguration;

@SpringBootApplication
public class BooksProjectApplication {

	public static void main(String[] args) {
		System.out.println("***************** AQUI *****************");
		System.out.println("***************** AQUI 2*****************");
		System.out.println("***************** GEOLOCALIZAÇÃO *****************");
		SpringApplication.run(BooksProjectApplication.class, args);
	}

}

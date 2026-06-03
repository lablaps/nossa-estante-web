package br.com.treinaweb.twjobs;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.jdbc.DataSourceAutoConfiguration;

@SpringBootApplication
public class BooksProjectApplication {

	public static void main(String[] args) {
		SpringApplication.run(BooksProjectApplication.class, args);
	}

}

package id.tu.service;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.data.web.config.EnableSpringDataWebSupport;

@SpringBootApplication
@EnableSpringDataWebSupport(pageSerializationMode = EnableSpringDataWebSupport.PageSerializationMode.VIA_DTO)
@ComponentScan(basePackages = {"id.tu.service"})
public class TokenpayApp {

	public static void main(String[] args) {
		SpringApplication.run(TokenpayApp.class, args);
	}

}

package id.tu.service.config;


import java.util.List;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Contact;
import io.swagger.v3.oas.models.info.Info;
import io.swagger.v3.oas.models.info.License;
import io.swagger.v3.oas.models.servers.Server;

@Configuration
public class OpenAPIConfig {

    @Value("${tokenpay.tu.openapi.dev-url}")
    private String devUrl;

    @Value("${tokenpay.tu.openapi.prod-url}")
    private String prodUrl;

    @Bean
    public OpenAPI myOpenAPI() {
        Server devServer = new Server();
        devServer.setUrl(devUrl);
        devServer.setDescription("Server URL in Development environment");

        Server prodServer = new Server();
        prodServer.setUrl(prodUrl);
        prodServer.setDescription("Server URL in Production environment");

        Contact contact = new Contact();
        contact.setEmail("admin@group.tu.id");
        contact.setName("GroupJihan Dev Teams");
        contact.setUrl("https://www.tu.id");

        License mitLicense = new License().name("MIT License").url("https://choosealicense.com/licenses/mit/");

        Info info = new Info()
                .title("Tokenpay Apps API Management")
                .version("1.0")
                .contact(contact)
                .description("The Tokenpay Apps API Management system is designed to manage and streamline communication between various applications and services within the SmartHUB ecosystem. It exposes endpoints for managing resources, configurations, and data workflows. The API supports a range of functionalities, such as CRUD operations, configuration management, and assignment handling, allowing seamless integration and automation of tasks across SmartHUB applications. With built-in support for OpenAPI standards, it provides comprehensive documentation, enabling developers to interact with endpoints efficiently in development and production environments").termsOfService("https://www.todo.tu.id/terms")
                .license(mitLicense);

        return new OpenAPI().info(info).servers(List.of(devServer, prodServer));
    }
}

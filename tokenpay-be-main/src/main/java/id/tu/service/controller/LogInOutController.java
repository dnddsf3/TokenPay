package id.tu.service.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/auth")
public class LogInOutController {

    @GetMapping("/login")
    public String publicLoginInfo() {
        return "This is a public endpoint.";
    }

    @GetMapping("/logout")
    public String publicLogoutInfo() {
        return "This is a public endpoint.";
    }
}

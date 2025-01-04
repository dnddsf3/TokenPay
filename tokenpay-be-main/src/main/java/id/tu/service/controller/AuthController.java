package id.tu.service.controller;

import id.tu.service.config.CustomUserDetails;
import id.tu.service.domain.dto.user.UserRequestCreateDTO;
import id.tu.service.domain.dto.user.UserResponseDTO;
import id.tu.service.domain.service.UserService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.servlet.http.HttpSession;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.Collection;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/auth")
public class AuthController {

    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private PasswordEncoder passwordEncoder;

    private final UserService userService;

    public AuthController(UserService userService) {
        this.userService = userService;
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestParam String username, @RequestParam String password) {
        try {
            // Authenticate the user
            Authentication authentication = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(username, password)
            );

            // Set the authentication in the security context
            SecurityContextHolder.getContext().setAuthentication(authentication);

            // Get user details from the authentication object
            UserDetails userDetails = (UserDetails) authentication.getPrincipal();

            // Fetch userId (assuming UserDetails is customized to include userId)
            Long userId = null;
            if (userDetails instanceof CustomUserDetails) { // Replace CustomUserDetails with your UserDetails implementation
                userId = ((CustomUserDetails) userDetails).getId();
            }

            // Get user roles from the authentication object
            Collection<? extends GrantedAuthority> authorities = authentication.getAuthorities();
            List<String> roles = authorities.stream()
                    .map(GrantedAuthority::getAuthority)
                    .collect(Collectors.toList());

            // Return a success response
            Map<String, Object> response = new HashMap<>();
            response.put("message", "Login successful");
            response.put("username", authentication.getName());
            response.put("roles", roles);
            response.put("userId", userId);

            return ResponseEntity.ok(response);

        } catch (Exception e) {
            // Handle authentication failure
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid username or password");
        }
    }


    @PostMapping("/logout")
    public ResponseEntity<?> logout(HttpServletRequest request, HttpServletResponse response) {
        // Invalidate the session and clear security context
        HttpSession session = request.getSession(false);
        if (session != null) {
            session.invalidate();
        }
        SecurityContextHolder.clearContext();

        // Return a success response
        Map<String, String> responseBody = new HashMap<>();
        responseBody.put("message", "Logout successful");
        return ResponseEntity.ok(responseBody);
    }

    @PostMapping("/signup")
    public ResponseEntity<UserResponseDTO> signup(@RequestBody UserRequestCreateDTO createDTO) {
        UserResponseDTO response = userService.createUser(createDTO);
        return ResponseEntity.ok(response);
    }
}

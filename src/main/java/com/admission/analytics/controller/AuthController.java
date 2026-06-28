package com.admission.analytics.controller;

import com.admission.analytics.model.User;
import com.admission.analytics.service.AuthService;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "*")
public class AuthController {

    private final AuthService authService;

    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    @PostMapping("/signup")
    public User signup(@RequestBody SignupRequest request) {
        return authService.registerUser(request.getUsername(), request.getEmail(), request.getPassword());
    }

    @PostMapping("/login")
    public User login(@RequestBody LoginRequest request) {
        return authService.loginUser(request.getUsernameOrEmail(), request.getPassword());
    }

    // DTO for Signup Request
    public static class SignupRequest {
        private String username;
        private String email;
        private String password;

        public SignupRequest() {}

        public String getUsername() {
            return username;
        }

        public void setUsername(String username) {
            this.username = username;
        }

        public String getEmail() {
            return email;
        }

        public void setEmail(String email) {
            this.email = email;
        }

        public String getPassword() {
            return password;
        }

        public void setPassword(String password) {
            this.password = password;
        }
    }

    // DTO for Login Request
    public static class LoginRequest {
        private String usernameOrEmail;
        private String password;

        public LoginRequest() {}

        public String getUsernameOrEmail() {
            return usernameOrEmail;
        }

        public void setUsernameOrEmail(String usernameOrEmail) {
            this.usernameOrEmail = usernameOrEmail;
        }

        public String getPassword() {
            return password;
        }

        public void setPassword(String password) {
            this.password = password;
        }
    }
}

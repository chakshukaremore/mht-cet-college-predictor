package com.admission.analytics.service;

import com.admission.analytics.model.User;
import com.admission.analytics.repository.UserRepository;
import org.mindrot.jbcrypt.BCrypt;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.util.Optional;

@Service
public class AuthService {

    private final UserRepository userRepository;

    public AuthService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    public User registerUser(String username, String email, String password) {
        // Validate inputs
        if (username == null || username.trim().isEmpty() ||
            email == null || email.trim().isEmpty() ||
            password == null || password.trim().isEmpty()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "All fields are required.");
        }

        // Check if username already exists
        if (userRepository.findByUsername(username).isPresent()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Username is already taken.");
        }

        // Check if email already exists
        if (userRepository.findByEmail(email).isPresent()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Email is already registered.");
        }

        // Hash the password securely using BCrypt
        String hashedPassword = BCrypt.hashpw(password, BCrypt.gensalt());
        
        User user = new User(username, email, hashedPassword);
        return userRepository.save(user);
    }

    public User loginUser(String usernameOrEmail, String password) {
        if (usernameOrEmail == null || usernameOrEmail.trim().isEmpty() ||
            password == null || password.trim().isEmpty()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Username/Email and Password are required.");
        }

        // Search user by username or email
        Optional<User> userOpt = userRepository.findByUsername(usernameOrEmail);
        if (userOpt.isEmpty()) {
            userOpt = userRepository.findByEmail(usernameOrEmail);
        }

        if (userOpt.isEmpty()) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Invalid username/email or password.");
        }

        User user = userOpt.get();

        // Check if hashed password matches the input password
        if (!BCrypt.checkpw(password, user.getPassword())) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Invalid username/email or password.");
        }

        // Clear password hash before returning the user to keep JSON output secure
        User secureUser = new User();
        secureUser.setId(user.getId());
        secureUser.setUsername(user.getUsername());
        secureUser.setEmail(user.getEmail());
        
        return secureUser;
    }
}

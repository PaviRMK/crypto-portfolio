package demo.Crypto_Portfolio.app.controller;

import demo.Crypto_Portfolio.app.model.User;
import demo.Crypto_Portfolio.app.repository.UserRepository;
import demo.Crypto_Portfolio.app.security.JwtUtil;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/user")
@CrossOrigin(origins = "http://localhost:3000")
public class UserController {

    @Autowired
    private JwtUtil jwtUtil;

    @Autowired
    private UserRepository userRepository;

    @GetMapping("/profile")
    public ResponseEntity<?> getUserProfile(
            @RequestHeader(value = "Authorization", required = false) String authHeader) {

        try {

            // 🔒 Check token exists
            if (authHeader == null || !authHeader.startsWith("Bearer ")) {
                return ResponseEntity.status(401).body("Missing or invalid token");
            }

            // 🔑 Extract email from token
            String token = authHeader.substring(7);
            String email = jwtUtil.extractEmail(token);

            // 🔍 Fetch user from DB
            User user = userRepository.findByEmail(email)
                    .orElseThrow(() -> new RuntimeException("User not found"));

            // 📦 Response
            Map<String, Object> response = new HashMap<>();
            response.put("name", user.getUsername());
            response.put("email", user.getEmail());
            response.put(
                    "joinDate",
                    user.getCreatedAt() != null
                            ? user.getCreatedAt().toLocalDate().toString()
                            : "N/A"
            );

            return ResponseEntity.ok(response);

        } catch (Exception e) {
            return ResponseEntity.status(403).body("Invalid or expired token");
        }
    }
}
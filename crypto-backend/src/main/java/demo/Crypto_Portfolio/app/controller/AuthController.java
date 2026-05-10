package demo.Crypto_Portfolio.app.controller;

import demo.Crypto_Portfolio.app.security.JwtUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import org.springframework.http.ResponseEntity;
import org.springframework.http.HttpStatus;


import demo.Crypto_Portfolio.app.model.User;
import demo.Crypto_Portfolio.app.service.UserService;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "http://localhost:3000")

public class AuthController {

    @Autowired
    private UserService userService;
    @Autowired
    private JwtUtil jwtUtil;
    // REGISTER
    @PostMapping("/register")
    public String register(@RequestBody User user) {
        System.out.println("Register API Hit");
        return userService.register(user);
    }

    // LOGIN

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody Map<String, String> request) {

        String email = request.get("email");
        String password = request.get("password");

        boolean isValid = userService.login(email, password);

        if (!isValid) {
            return ResponseEntity.status(401).body("Invalid Email or Password");
        }

        // ✅ GENERATE TOKEN
        String token = jwtUtil.generateToken(email);

        // ✅ RETURN TOKEN (IMPORTANT)
        Map<String, String> response = new HashMap<>();
        response.put("token", token);

        return ResponseEntity.ok(response);
    }

}

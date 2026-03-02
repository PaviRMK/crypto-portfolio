package demo.Crypto_Portfolio.app.controller;

import org.springframework.web.bind.annotation.*;
import org.springframework.http.ResponseEntity;
import java.util.List;
import demo.Crypto_Portfolio.app.service.PortfolioService;
import demo.Crypto_Portfolio.app.model.*;
import demo.Crypto_Portfolio.app.dto.PortfolioSummaryDTO;

@RestController
@RequestMapping("/api/portfolio")
@CrossOrigin(origins = "http://localhost:3000")
public class PortfolioController {

    private final PortfolioService portfolioService;

    public PortfolioController(PortfolioService portfolioService) {
        this.portfolioService = portfolioService;
    }

    @PostMapping("/trade")
    public ResponseEntity<Trade> addTrade(
            @RequestParam Long userId,
            @RequestBody Trade trade) {

        return ResponseEntity.ok(
                portfolioService.addTrade(userId, trade)
        );
    }

    @GetMapping("/holdings")
    public ResponseEntity<List<Holding>> getHoldings(
            @RequestParam Long userId) {

        return ResponseEntity.ok(
                portfolioService.getHoldings(userId)
        );
    }

    @GetMapping("/trades")
    public ResponseEntity<List<Trade>> getTrades(
            @RequestParam Long userId) {

        return ResponseEntity.ok(
                portfolioService.getTrades(userId)
        );
    }
    @GetMapping("/summary")
    public ResponseEntity<PortfolioSummaryDTO> getSummary(
            @RequestParam Long userId) {

        return ResponseEntity.ok(
                portfolioService.getPortfolioSummary(userId)
        );
    }

    @GetMapping("/risk")
    public ResponseEntity<String> getRisk(
            @RequestParam Long userId) {

        return ResponseEntity.ok(
                portfolioService.calculateRiskLevel(userId)
        );
    }
}
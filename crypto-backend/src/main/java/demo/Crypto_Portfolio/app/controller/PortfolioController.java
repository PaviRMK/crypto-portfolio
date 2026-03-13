package demo.Crypto_Portfolio.app.controller;

import org.springframework.web.bind.annotation.*;
import org.springframework.http.ResponseEntity;
import java.util.List;

import demo.Crypto_Portfolio.app.service.PortfolioService;
import demo.Crypto_Portfolio.app.model.*;
import demo.Crypto_Portfolio.app.dto.portfolio.PortfolioSummaryDTO;
import demo.Crypto_Portfolio.app.dto.portfolio.HoldingLiveDTO;
import demo.Crypto_Portfolio.app.dto.portfolio.RiskAlertDTO;

@RestController
@RequestMapping("/api/portfolio")
@CrossOrigin(origins = "http://localhost:3000")
public class PortfolioController {

    private final PortfolioService portfolioService;

    public PortfolioController(PortfolioService portfolioService) {

        this.portfolioService = portfolioService;
    }


    // 🔥 NEW LIVE HOLDINGS API
    @GetMapping("/holdings-live")
    public ResponseEntity<List<HoldingLiveDTO>> getHoldingsLive(
            @RequestParam Long userId) {

        return ResponseEntity.ok(
                portfolioService.getHoldingsWithLive(userId)
        );
    }

    @GetMapping("/holdings")
    public ResponseEntity<List<Holding>> getHoldings(
            @RequestParam Long userId) {

        return ResponseEntity.ok(
                portfolioService.getHoldings(userId)
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
    @GetMapping("/risk-alerts")
    public ResponseEntity<List<RiskAlertDTO>> getRiskAlerts(
            @RequestParam Long userId) {

        return ResponseEntity.ok(
                portfolioService.getRiskAlerts(userId)
        );
    }
    @GetMapping("/trades")
    public ResponseEntity<List<Trade>> getTrades(
            @RequestParam Long userId) {

        return ResponseEntity.ok(
                portfolioService.getTrades(userId)
        );
    }
}
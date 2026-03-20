package demo.Crypto_Portfolio.app.controller;

import org.springframework.web.bind.annotation.*;
import org.springframework.http.ResponseEntity;
import java.util.List;

import demo.Crypto_Portfolio.app.service.PortfolioService;
import demo.Crypto_Portfolio.app.model.*;
import demo.Crypto_Portfolio.app.dto.portfolio.PortfolioSummaryDTO;
import demo.Crypto_Portfolio.app.dto.portfolio.HoldingLiveDTO;
import demo.Crypto_Portfolio.app.dto.portfolio.RiskAlertDTO;
import demo.Crypto_Portfolio.app.dto.portfolio.PnlSummaryDTO;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;

@RestController
@RequestMapping("/api/portfolio")
@CrossOrigin(origins = "http://localhost:3000")
public class PortfolioController {

    private final PortfolioService portfolioService;

    public PortfolioController(PortfolioService portfolioService) {

        this.portfolioService = portfolioService;
    }


    // LIVE HOLDINGS API
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
    @GetMapping("/pnl")
    public PnlSummaryDTO getPnl(@RequestParam Long userId) {
        return portfolioService.getPnlSummary(userId);
    }
    @GetMapping("/export")
    public String exportCsv(@RequestParam Long userId) {
        return portfolioService.generateCsv(userId);
    }
    @GetMapping("/tax-hint")
    public ResponseEntity<String> getTaxHint(@RequestParam Long userId) {
        return ResponseEntity.ok(
                portfolioService.getTaxHint(userId)
        );
    }
}
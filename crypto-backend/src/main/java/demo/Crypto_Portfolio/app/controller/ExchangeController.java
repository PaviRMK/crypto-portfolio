package demo.Crypto_Portfolio.app.controller;

import demo.Crypto_Portfolio.app.service.ExchangeService;
import demo.Crypto_Portfolio.app.dto.exchange.ConnectExchangeRequest;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/exchange")
@CrossOrigin(origins = "http://localhost:3000")
public class ExchangeController {

    private final ExchangeService exchangeService;

    public ExchangeController(ExchangeService exchangeService) {
        this.exchangeService = exchangeService;
    }

    @PostMapping("/connect")
    public String connectExchange(@RequestBody ConnectExchangeRequest request) {

        return exchangeService.connectExchange(request);
    }
    @GetMapping("/sync")
    public String syncPortfolio(
            @RequestParam Long userId,
            @RequestParam Long exchangeId) {

        return exchangeService.syncPortfolio(userId, exchangeId);
    }
    @GetMapping("/sync-trades")
    public ResponseEntity<String> syncTrades(
            @RequestParam Long userId,
            @RequestParam Long exchangeId) {

        return ResponseEntity.ok(
                exchangeService.syncTrades(userId, exchangeId)
        );
    }
}
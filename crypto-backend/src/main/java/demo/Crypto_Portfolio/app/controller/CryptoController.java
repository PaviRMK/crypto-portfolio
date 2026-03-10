package demo.Crypto_Portfolio.app.controller;

import demo.Crypto_Portfolio.app.service.CryptoService;
import demo.Crypto_Portfolio.app.model.ExchangeDTO;

import org.springframework.web.bind.annotation.*;
import org.springframework.http.ResponseEntity;

import java.util.List;

@RestController
@RequestMapping("/api/crypto")
@CrossOrigin(origins = "http://localhost:3000")
public class CryptoController {

    private final CryptoService cryptoService;

    public CryptoController(CryptoService cryptoService) {
        this.cryptoService = cryptoService;
    }

    @GetMapping("/top-coins")
    public ResponseEntity<?> getTopCoins(
            @RequestParam String currency,
            @RequestParam int perPage
    ) {
        return ResponseEntity.ok(
                cryptoService.getTopCoins(currency, perPage)
        );
    }

    @GetMapping("/chart")
    public ResponseEntity<?> getChartData(
            @RequestParam String coinId,
            @RequestParam String currency,
            @RequestParam int days
    ) {
        return ResponseEntity.ok(
                cryptoService.getChartData(coinId, currency, days)
        );
    }

    @GetMapping("/exchange")
    public ResponseEntity<List<ExchangeDTO>> getExchangeDetails(
            @RequestParam String coinId
    ) {
        return ResponseEntity.ok(
                cryptoService.getExchangeDetails(coinId)
        );
    }
}







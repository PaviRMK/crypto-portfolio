package demo.Crypto_Portfolio.app.controller;

import demo.Crypto_Portfolio.app.service.CryptoService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import demo.Crypto_Portfolio.app.model.ExchangeDTO;

@RestController
@RequestMapping("/api/crypto")
@CrossOrigin(origins = "http://localhost:3000")
public class CryptoController {

    @Autowired
    private CryptoService cryptoService;

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
    @GetMapping("/top-coins")
    public ResponseEntity<?> getTopCoins(
            @RequestParam String currency,
            @RequestParam int perPage
    ) {
        return ResponseEntity.ok(
                cryptoService.getTopCoins(currency, perPage)
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

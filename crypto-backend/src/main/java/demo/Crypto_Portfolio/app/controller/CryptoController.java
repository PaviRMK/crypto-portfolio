package demo.Crypto_Portfolio.app.controller;

import demo.Crypto_Portfolio.app.service.CryptoService;
import demo.Crypto_Portfolio.app.service.PriceSnapshotService;

import org.springframework.web.bind.annotation.*;
import org.springframework.http.ResponseEntity;


import java.util.List;

@RestController
@RequestMapping("/api/crypto")
@CrossOrigin(origins = "http://localhost:3000")
public class CryptoController {

    private final CryptoService cryptoService;
    private final PriceSnapshotService priceSnapshotService;

    public CryptoController(CryptoService cryptoService,
                            PriceSnapshotService priceSnapshotService) {
        this.cryptoService = cryptoService;
        this.priceSnapshotService = priceSnapshotService;
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

    @GetMapping("/history")
    public ResponseEntity<?> getPriceHistory(
            @RequestParam String coin) {

        return ResponseEntity.ok(
                priceSnapshotService.getHistory(coin)
        );
    }
}







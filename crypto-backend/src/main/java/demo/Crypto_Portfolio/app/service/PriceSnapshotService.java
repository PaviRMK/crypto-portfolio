package demo.Crypto_Portfolio.app.service;

import demo.Crypto_Portfolio.app.model.PriceSnapshot;
import demo.Crypto_Portfolio.app.repository.PriceSnapshotRepository;

import com.fasterxml.jackson.databind.JsonNode;

import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class PriceSnapshotService {

    private final PriceSnapshotRepository snapshotRepository;
    private final CryptoService cryptoService;

    public PriceSnapshotService(
            PriceSnapshotRepository snapshotRepository,
            CryptoService cryptoService) {

        this.snapshotRepository = snapshotRepository;
        this.cryptoService = cryptoService;
    }

    // Runs every 10 minutes
    @Scheduled(fixedRate = 600000)

    public void capturePriceSnapshots() {

        String coins = "bitcoin,ethereum,solana";

        JsonNode prices = cryptoService.getMultipleLivePrices(coins, "usd");

        savePrice(prices, "bitcoin", "BTC");
        savePrice(prices, "ethereum", "ETH");
        savePrice(prices, "solana", "SOL");
    }

    private void savePrice(JsonNode prices, String coinId, String symbol) {

        if (prices.has(coinId)) {

            double price = prices.get(coinId).get("usd").asDouble();

            PriceSnapshot snapshot =
                    new PriceSnapshot(symbol, price, LocalDateTime.now());

            snapshotRepository.save(snapshot);
        }
    }

    public List<PriceSnapshot> getHistory(String coin) {

        return snapshotRepository
                .findByCoinSymbolOrderByTimestampAsc(coin);
    }
}
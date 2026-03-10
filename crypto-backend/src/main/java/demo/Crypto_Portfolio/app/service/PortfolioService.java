package demo.Crypto_Portfolio.app.service;

import demo.Crypto_Portfolio.app.dto.HoldingLiveDTO;
import org.springframework.stereotype.Service;
import com.fasterxml.jackson.databind.JsonNode;

import java.time.LocalDateTime;
import java.util.List;

import demo.Crypto_Portfolio.app.model.*;
import demo.Crypto_Portfolio.app.repository.*;
import demo.Crypto_Portfolio.app.dto.PortfolioSummaryDTO;

@Service
public class PortfolioService {

    private final TradeRepository tradeRepository;
    private final HoldingRepository holdingRepository;
    private final CryptoService cryptoService;

    public PortfolioService(TradeRepository tradeRepository,
                            HoldingRepository holdingRepository,
                            CryptoService cryptoService) {

        this.tradeRepository = tradeRepository;
        this.holdingRepository = holdingRepository;
        this.cryptoService = cryptoService;
    }

    // =============================
    // ADD TRADE
    // =============================

    public Trade addTrade(Long userId, Trade trade) {

        trade.setUserId(userId);
        trade.setExecutedAt(LocalDateTime.now());

        updateHolding(userId, trade);

        return tradeRepository.save(trade);
    }

    // =============================
    // UPDATE HOLDING
    // =============================

    private void updateHolding(Long userId, Trade trade) {

        Holding holding = holdingRepository
                .findByUserIdAndAssetSymbol(userId, trade.getAssetSymbol())
                .orElse(new Holding());

        holding.setUserId(userId);
        holding.setAssetSymbol(trade.getAssetSymbol());
        holding.setCoinId(convertSymbolToId(trade.getAssetSymbol()));
        double currentQty = holding.getQuantity();
        double currentAvg = holding.getAvgCost();

        if ("BUY".equalsIgnoreCase(trade.getSide())) {

            double totalInvestment =
                    (currentQty * currentAvg)
                            + (trade.getQuantity() * trade.getPrice())
                            + trade.getFee();

            double newQty = currentQty + trade.getQuantity();
            double newAvg = totalInvestment / newQty;

            holding.setQuantity(newQty);
            holding.setAvgCost(newAvg);

        }

        else if ("SELL".equalsIgnoreCase(trade.getSide())) {

            double sellQty = trade.getQuantity();

            double realized =
                    (trade.getPrice() - currentAvg) * sellQty
                            - trade.getFee();

            trade.setRealizedPnl(realized);

            double newQty = currentQty - sellQty;

            if (newQty <= 0) {

                holdingRepository.delete(holding);
                return;

            } else {

                holding.setQuantity(newQty);
            }
        }

        holding.setUpdatedAt(LocalDateTime.now());

        holdingRepository.save(holding);
    }

    // =============================
    // HOLDINGS
    // =============================

    public List<Holding> getHoldings(Long userId) {

        return holdingRepository.findByUserId(userId);
    }

    // =============================
    // TRADES
    // =============================

    public List<Trade> getTrades(Long userId) {

        return tradeRepository.findByUserId(userId);
    }

    // =============================
    // HOLDINGS WITH LIVE PRICE
    // =============================

    public List<HoldingLiveDTO> getHoldingsWithLive(Long userId) {

        List<Holding> holdings = holdingRepository.findByUserId(userId);

        // collect all coin ids
        String coinIds = holdings.stream()
                .map(h -> convertSymbolToId(h.getAssetSymbol()))
                .distinct()
                .reduce((a, b) -> a + "," + b)
                .orElse("");

        JsonNode prices = cryptoService.getMultipleLivePrices(coinIds, "usd");

        return holdings.stream().map(h -> {

            String coinId = convertSymbolToId(h.getAssetSymbol());

            double livePrice = 0;

            if (prices != null
                    && prices.has(coinId)
                    && prices.get(coinId) != null
                    && prices.get(coinId).has("usd")) {

                livePrice = prices.get(coinId).get("usd").asDouble();

            } else {

                livePrice = 0; // fallback when API limit reached
            }

            double quantity = h.getQuantity();
            double currentValue = quantity * livePrice;
            double invested = quantity * h.getAvgCost();
            double unrealizedPnl = quantity == 0 ? 0 : currentValue - invested;

            return new HoldingLiveDTO(
                    h.getAssetSymbol(),
                    quantity,
                    h.getAvgCost(),
                    livePrice,
                    currentValue,
                    unrealizedPnl
            );

        }).toList();
    }

    // =============================
    // SUMMARY
    // =============================

    public PortfolioSummaryDTO getPortfolioSummary(Long userId) {

        List<Holding> holdings = holdingRepository.findByUserId(userId);

        double totalInvestment = 0;
        double currentValue = 0;

        String coinIds = holdings.stream()
                .map(h -> convertSymbolToId(h.getAssetSymbol()))
                .distinct()
                .reduce((a, b) -> a + "," + b)
                .orElse("");

        JsonNode prices = cryptoService.getMultipleLivePrices(coinIds, "usd");

        for (Holding h : holdings) {

            double invested = h.getQuantity() * h.getAvgCost();
            totalInvestment += invested;

            String coinId = convertSymbolToId(h.getAssetSymbol());

            double livePrice = 0;

            if (prices.has(coinId) && prices.get(coinId).has("usd")) {
                livePrice = prices.get(coinId).get("usd").asDouble();
            }

            currentValue += h.getQuantity() * livePrice;
        }

        PortfolioSummaryDTO dto = new PortfolioSummaryDTO();

        dto.setTotalInvestment(totalInvestment);
        dto.setCurrentValue(currentValue);
        dto.setTotalPnl(currentValue - totalInvestment);

        return dto;
    }

    // =============================
    // RISK
    // =============================

    public String calculateRiskLevel(Long userId) {

        List<Holding> holdings = holdingRepository.findByUserId(userId);

        double total = holdings.stream()
                .mapToDouble(h -> h.getQuantity() * h.getAvgCost())
                .sum();

        if (total == 0) return "No Holdings";

        for (Holding h : holdings) {

            double value = h.getQuantity() * h.getAvgCost();

            double exposure = value / total;

            if (exposure > 0.7) {

                return "HIGH RISK - Overexposed to " + h.getAssetSymbol();
            }
        }

        return "Balanced Portfolio";
    }

    // =============================
    // SYMBOL → COINGECKO ID
    // =============================

    private String convertSymbolToId(String symbol) {

        switch (symbol.toUpperCase()) {

            case "BTC": return "bitcoin";
            case "ETH": return "ethereum";
            case "SOL": return "solana";
            case "XRP": return "ripple";
            case "ADA": return "cardano";
            case "DOGE": return "dogecoin";
            case "DOT": return "polkadot";
            case "MATIC": return "matic-network";
            case "TRX": return "tron";
            case "LTC": return "litecoin";

            default: return symbol.toLowerCase();
        }
    }
}
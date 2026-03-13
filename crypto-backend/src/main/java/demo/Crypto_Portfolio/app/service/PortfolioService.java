package demo.Crypto_Portfolio.app.service;

import demo.Crypto_Portfolio.app.dto.portfolio.HoldingLiveDTO;
import demo.Crypto_Portfolio.app.dto.portfolio.PortfolioSummaryDTO;
import demo.Crypto_Portfolio.app.dto.portfolio.RiskAlertDTO;
import demo.Crypto_Portfolio.app.model.Holding;
import demo.Crypto_Portfolio.app.model.Trade;
import demo.Crypto_Portfolio.app.repository.HoldingRepository;
import demo.Crypto_Portfolio.app.repository.TradeRepository;

import com.fasterxml.jackson.databind.JsonNode;

import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class PortfolioService {

    private final HoldingRepository holdingRepository;
    private final CryptoService cryptoService;
    private final TradeRepository tradeRepository;

    public PortfolioService(HoldingRepository holdingRepository,
                            CryptoService cryptoService,
                            TradeRepository tradeRepository) {

        this.holdingRepository = holdingRepository;
        this.cryptoService = cryptoService;
        this.tradeRepository = tradeRepository;
    }

    // =============================
    // HOLDINGS
    // =============================

    public List<Holding> getHoldings(Long userId) {
        return holdingRepository.findByUserId(userId);
    }

    // =============================
    // HOLDINGS WITH LIVE PRICE
    // =============================

    public List<HoldingLiveDTO> getHoldingsWithLive(Long userId) {

        List<Holding> holdings = holdingRepository.findByUserId(userId);

        String coinIds = holdings.stream()
                .map(h -> convertSymbolToId(h.getAssetSymbol()))
                .distinct()
                .reduce((a, b) -> a + "," + b)
                .orElse("");

        JsonNode prices = cryptoService.getMultipleLivePrices(coinIds, "usd");

        return holdings.stream().map(h -> {

            String coinId = convertSymbolToId(h.getAssetSymbol());

            double livePrice = 0;

            if (prices != null &&
                    prices.has(coinId) &&
                    prices.get(coinId).has("usd")) {

                livePrice = prices.get(coinId).get("usd").asDouble();
            }

            double quantity = h.getQuantity();
            double currentValue = quantity * livePrice;
            double invested = quantity * h.getAvgCost();
            double pnl = currentValue - invested;

            return new HoldingLiveDTO(
                    h.getAssetSymbol(),
                    quantity,
                    h.getAvgCost(),
                    livePrice,
                    currentValue,
                    pnl
            );

        }).toList();
    }

    // =============================
    // PORTFOLIO SUMMARY
    // =============================

    public PortfolioSummaryDTO getPortfolioSummary(Long userId) {

        List<Holding> holdings = holdingRepository.findByUserId(userId);

        double totalInvestment = 0;
        double totalValue = 0;

        String coinIds = holdings.stream()
                .map(h -> convertSymbolToId(h.getAssetSymbol()))
                .distinct()
                .reduce((a, b) -> a + "," + b)
                .orElse("");

        JsonNode prices = cryptoService.getMultipleLivePrices(coinIds, "usd");

        for (Holding h : holdings) {

            double investment = h.getQuantity() * h.getAvgCost();
            totalInvestment += investment;

            String coinId = convertSymbolToId(h.getAssetSymbol());

            double livePrice = 0;

            if (prices != null &&
                    prices.has(coinId) &&
                    prices.get(coinId).has("usd")) {

                livePrice = prices.get(coinId).get("usd").asDouble();
            }

            totalValue += h.getQuantity() * livePrice;
        }

        PortfolioSummaryDTO dto = new PortfolioSummaryDTO();

        dto.setTotalInvestment(totalInvestment);
        dto.setTotalValue(totalValue);
        dto.setTotalPnl(totalValue - totalInvestment);

        return dto;
    }

    // =============================
    // TRADES
    // =============================

    public List<Trade> getTrades(Long userId) {
        return tradeRepository.findByUserId(userId);
    }

    // =============================
    // SAVE TRADE
    // =============================

    public Trade saveTrade(Long userId, Trade trade) {

        trade.setUserId(userId);

        Trade savedTrade = tradeRepository.save(trade);

        updateHoldingFromTrade(savedTrade);

        return savedTrade;
    }

    // =============================
    // UPDATE HOLDING FROM TRADE
    // =============================

    private void updateHoldingFromTrade(Trade trade) {

        String symbol = trade.getSymbol();

        Holding holding = holdingRepository
                .findByUserIdAndAssetSymbol(trade.getUserId(), symbol)
                .orElse(new Holding());

        holding.setUserId(trade.getUserId());
        holding.setAssetSymbol(symbol);

        double currentQty = holding.getQuantity();

        if ("BUY".equalsIgnoreCase(trade.getSide())) {

            double newQty = currentQty + trade.getQuantity();

            // average cost calculation
            double currentInvestment = currentQty * holding.getAvgCost();
            double newInvestment = trade.getQuantity() * trade.getPrice();

            double avgCost = (currentInvestment + newInvestment) / newQty;

            holding.setQuantity(newQty);
            holding.setAvgCost(avgCost);

        } else if ("SELL".equalsIgnoreCase(trade.getSide())) {

            double newQty = currentQty - trade.getQuantity();

            if (newQty <= 0) {

                holdingRepository.delete(holding);
                return;
            }

            holding.setQuantity(newQty);
        }

        holdingRepository.save(holding);
    }

    // =============================
    // RISK LEVEL
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
    // RISK ALERTS
    // =============================

    // =============================
    // SYMBOL → COINGECKO ID
    // =============================

    private String convertSymbolToId(String symbol) {

        switch (symbol.toUpperCase()) {

            case "BTC": return "bitcoin";
            case "ETH": return "ethereum";
            case "SOL": return "solana";
            case "BNB": return "binancecoin";
            case "USDT": return "tether";
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
    public List<RiskAlertDTO> getRiskAlerts(Long userId) {

        List<Holding> holdings = holdingRepository.findByUserId(userId);
        List<RiskAlertDTO> alerts = new ArrayList<>();

        double totalValue = holdings.stream()
                .mapToDouble(h -> h.getQuantity() * h.getAvgCost())
                .sum();

        for (Holding h : holdings) {

            double value = h.getQuantity() * h.getAvgCost();

            if (totalValue == 0) continue;

            double exposure = value / totalValue;

            if (exposure > 0.7) {

                alerts.add(new RiskAlertDTO(
                        h.getAssetSymbol(),
                        "Portfolio heavily concentrated in " + h.getAssetSymbol(),
                        "HIGH"
                ));
            }
        }

        return alerts;
    }
}
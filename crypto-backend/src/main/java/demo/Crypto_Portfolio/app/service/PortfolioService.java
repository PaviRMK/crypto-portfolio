package demo.Crypto_Portfolio.app.service;

import demo.Crypto_Portfolio.app.dto.portfolio.HoldingLiveDTO;
import demo.Crypto_Portfolio.app.dto.portfolio.PortfolioSummaryDTO;
import demo.Crypto_Portfolio.app.dto.portfolio.RiskAlertDTO;
import demo.Crypto_Portfolio.app.model.Holding;
import demo.Crypto_Portfolio.app.model.PriceSnapshot;
import demo.Crypto_Portfolio.app.model.Trade;
import demo.Crypto_Portfolio.app.repository.HoldingRepository;
import demo.Crypto_Portfolio.app.repository.PriceSnapshotRepository;
import demo.Crypto_Portfolio.app.repository.TradeRepository;
import demo.Crypto_Portfolio.app.repository.RiskAlertRepository;
import demo.Crypto_Portfolio.app.model.RiskAlert;

import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.time.LocalDateTime;

@Service
public class PortfolioService {

    private final HoldingRepository holdingRepository;
    private final TradeRepository tradeRepository;
    private final ScamService scamService;
    private final PriceSnapshotRepository snapshotRepository;
    private final CryptoService cryptoService;
    private final RiskAlertRepository riskAlertRepository;

    public PortfolioService(
            HoldingRepository holdingRepository,
            TradeRepository tradeRepository,
            PriceSnapshotRepository snapshotRepository,
            CryptoService cryptoService,
            ScamService scamService,
            RiskAlertRepository riskAlertRepository){

        this.holdingRepository = holdingRepository;
        this.tradeRepository = tradeRepository;
        this.snapshotRepository = snapshotRepository;
        this.cryptoService=cryptoService;
        this.riskAlertRepository=riskAlertRepository;
        this.scamService = scamService;
    }

    // =============================
    // BASIC HOLDINGS
    // =============================

    public List<Holding> getHoldings(Long userId) {
        return holdingRepository.findByUserId(userId);
    }

    // =============================
    // HOLDINGS WITH LIVE PRICE
    // =============================

    public List<HoldingLiveDTO> getHoldingsWithLive(Long userId) {

        List<Holding> holdings = holdingRepository.findByUserId(userId);

        return holdings.stream().map(h -> {

            double livePrice = snapshotRepository
                    .findTopByCoinSymbolOrderByTimestampDesc(h.getAssetSymbol())
                    .map(PriceSnapshot::getPrice)
                    .orElse(0.0);

            double quantity = h.getQuantity();
            double currentValue = quantity * livePrice;
            double invested = quantity * h.getAvgCost();
            double pnl = currentValue - invested;

            String riskLevel = calculateHoldingRisk(pnl, invested);

            return new HoldingLiveDTO(
                    h.getAssetSymbol(),
                    quantity,
                    h.getAvgCost(),
                    livePrice,
                    currentValue,
                    pnl,
                    riskLevel
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

        for (Holding h : holdings) {

            double livePrice = snapshotRepository
                    .findTopByCoinSymbolOrderByTimestampDesc(h.getAssetSymbol())
                    .map(PriceSnapshot::getPrice)
                    .orElse(0.0);

            double investment = h.getQuantity() * h.getAvgCost();
            totalInvestment += investment;

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

        // 🔥 ADD THIS LINE
        holding.setContractAddress(trade.getContractAddress());

        double currentQty = holding.getQuantity();

        if ("BUY".equalsIgnoreCase(trade.getSide())) {

            double newQty = currentQty + trade.getQuantity();

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
    public List<RiskAlertDTO> getRiskAlerts(Long userId) {

        List<Holding> holdings = holdingRepository.findByUserId(userId);

        List<RiskAlertDTO> alerts = new ArrayList<>();

        double totalValue = 0;

        // Calculate total portfolio value
        for (Holding h : holdings) {

            double livePrice = snapshotRepository
                    .findTopByCoinSymbolOrderByTimestampDesc(h.getAssetSymbol())
                    .map(PriceSnapshot::getPrice)
                    .orElse(0.0);

            totalValue += h.getQuantity() * livePrice;
        }

        // Generate alerts
        for (Holding h : holdings) {

            String symbol = h.getAssetSymbol();

            double livePrice = snapshotRepository
                    .findTopByCoinSymbolOrderByTimestampDesc(symbol)
                    .map(PriceSnapshot::getPrice)
                    .orElse(0.0);

            double value = h.getQuantity() * livePrice;
            double investment = h.getQuantity() * h.getAvgCost();

            double exposure = totalValue == 0 ? 0 : value / totalValue;

            // =============================
            // 1️⃣ Concentration Risk
            // =============================
            if (exposure > 0.5) {

                alerts.add(new RiskAlertDTO(
                        symbol,
                        "⚠️ " + (int)(exposure * 100) + "% of your portfolio is in " + symbol + ". Consider diversifying.",
                        "HIGH"
                ));
            }

            // =============================
            // 2️⃣ Loss Risk
            // =============================
            double pnlPercent = investment == 0 ? 0 : ((value - investment) / investment) * 100;

            if (pnlPercent < -5) {

                alerts.add(new RiskAlertDTO(
                        symbol,
                        "📉 " + symbol + " dropped " + String.format("%.2f", Math.abs(pnlPercent)) + "% from your buy price. Review your position.",
                        "MEDIUM"
                ));
            }

            // =============================
            // 3️⃣ Scam Detection
            // =============================
            String contractAddress = h.getContractAddress();

            boolean scam = scamService.isScamToken(contractAddress);

            if (scam) {

                alerts.add(new RiskAlertDTO(
                        symbol,
                        "🚨 " + symbol + " is flagged as a scam token. Avoid trading immediately.",
                        "CRITICAL"
                ));

                RiskAlert entity = new RiskAlert(
                        userId,
                        symbol,
                        "SCAM",
                        "Token flagged as scam",
                        LocalDateTime.now()
                );

                riskAlertRepository.save(entity);
            }
        }

        return alerts;
    }

    // =============================
    // HOLDING RISK
    // =============================

    private String calculateHoldingRisk(double pnl, double investment) {

        if (investment == 0) return "LOW";

        double pnlPercent = (pnl / investment) * 100;

        if (pnlPercent <= -5) return "HIGH";
        else if (pnlPercent < 0) return "MEDIUM";
        else return "LOW";
    }
}
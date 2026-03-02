package demo.Crypto_Portfolio.app.service;

import org.springframework.stereotype.Service;
import java.time.LocalDateTime;
import java.util.List;

import demo.Crypto_Portfolio.app.model.*;
import demo.Crypto_Portfolio.app.repository.*;
import demo.Crypto_Portfolio.app.dto.PortfolioSummaryDTO;

@Service
public class PortfolioService {

    private final TradeRepository tradeRepository;
    private final HoldingRepository holdingRepository;

    public PortfolioService(TradeRepository tradeRepository,
                            HoldingRepository holdingRepository) {
        this.tradeRepository = tradeRepository;
        this.holdingRepository = holdingRepository;
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

        double currentQty = holding.getQuantity();
        double currentAvg = holding.getAvgCost();

        if ("BUY".equalsIgnoreCase(trade.getSide())) {

            double totalInvestment =
                    (currentQty * currentAvg) +
                            (trade.getQuantity() * trade.getPrice()) +
                            trade.getFee();

            double newQty = currentQty + trade.getQuantity();
            double newAvg = totalInvestment / newQty;

            holding.setQuantity(newQty);
            holding.setAvgCost(newAvg);

        } else if ("SELL".equalsIgnoreCase(trade.getSide())) {

            double sellQty = trade.getQuantity();

            double realized =
                    (trade.getPrice() - currentAvg) * sellQty
                            - trade.getFee();

            trade.setRealizedPnl(realized);

            double newQty = currentQty - sellQty;
            holding.setQuantity(Math.max(newQty, 0));
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

    public List<Trade> getTrades(Long userId) {
        return tradeRepository.findByUserId(userId);
    }

    // =============================
    // SUMMARY
    // =============================

    public PortfolioSummaryDTO getPortfolioSummary(Long userId) {

        List<Holding> holdings = holdingRepository.findByUserId(userId);

        double totalInvestment = 0;
        double currentValue = 0;

        for (Holding h : holdings) {

            double invested = h.getQuantity() * h.getAvgCost();
            totalInvestment += invested;

            // placeholder current price (can connect CoinGecko later)
            double marketValue = invested;
            currentValue += marketValue;
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
}
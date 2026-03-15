package demo.Crypto_Portfolio.app.dto.portfolio;

public class HoldingLiveDTO {

    private String assetSymbol;
    private double quantity;
    private double avgCost;
    private double livePrice;
    private double currentValue;
    private double unrealizedPnl;
    private String riskLevel;

    public HoldingLiveDTO(String assetSymbol,
                          double quantity,
                          double avgCost,
                          double livePrice,
                          double currentValue,
                          double unrealizedPnl,
                          String riskLevel) {

        this.assetSymbol = assetSymbol;
        this.quantity = quantity;
        this.avgCost = avgCost;
        this.livePrice = livePrice;
        this.currentValue = currentValue;
        this.unrealizedPnl = unrealizedPnl;
        this.riskLevel = riskLevel;
    }

    public String getAssetSymbol() { return assetSymbol; }
    public double getQuantity() { return quantity; }
    public double getAvgCost() { return avgCost; }
    public double getLivePrice() { return livePrice; }
    public double getCurrentValue() { return currentValue; }
    public double getUnrealizedPnl() { return unrealizedPnl; }
    public String getRiskLevel() { return riskLevel; }
}
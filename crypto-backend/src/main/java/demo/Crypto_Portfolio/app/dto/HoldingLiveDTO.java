package demo.Crypto_Portfolio.app.dto;

public class HoldingLiveDTO {

    private String assetSymbol;
    private double quantity;
    private double avgCost;
    private double livePrice;
    private double currentValue;
    private double unrealizedPnl;

    public HoldingLiveDTO(String assetSymbol,
                          double quantity,
                          double avgCost,
                          double livePrice,
                          double currentValue,
                          double unrealizedPnl) {

        this.assetSymbol = assetSymbol;
        this.quantity = quantity;
        this.avgCost = avgCost;
        this.livePrice = livePrice;
        this.currentValue = currentValue;
        this.unrealizedPnl = unrealizedPnl;
    }

    public String getAssetSymbol() { return assetSymbol; }
    public double getQuantity() { return quantity; }
    public double getAvgCost() { return avgCost; }
    public double getLivePrice() { return livePrice; }
    public double getCurrentValue() { return currentValue; }
    public double getUnrealizedPnl() { return unrealizedPnl; }
}
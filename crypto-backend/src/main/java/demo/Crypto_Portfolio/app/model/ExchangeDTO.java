package demo.Crypto_Portfolio.app.model;

public class ExchangeDTO {

    private String exchangeName;
    private String pair;
    private double lastPrice;
    private double volume;
    private String trustScore;

    public ExchangeDTO(String exchangeName, String pair,
                       double lastPrice, double volume, String trustScore) {
        this.exchangeName = exchangeName;
        this.pair = pair;
        this.lastPrice = lastPrice;
        this.volume = volume;
        this.trustScore = trustScore;
    }

    public String getExchangeName() {
        return exchangeName;
    }

    public String getPair() {
        return pair;
    }

    public double getLastPrice() {
        return lastPrice;
    }

    public double getVolume() {
        return volume;
    }

    public String getTrustScore() {
        return trustScore;
    }
}
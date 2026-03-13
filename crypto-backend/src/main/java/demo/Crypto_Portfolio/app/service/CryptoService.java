package demo.Crypto_Portfolio.app.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.ArrayList;
import java.util.List;

@Service
public class CryptoService {

    private final RestTemplate restTemplate;
    private final ObjectMapper objectMapper;

    public CryptoService(RestTemplate restTemplate, ObjectMapper objectMapper) {
        this.restTemplate = restTemplate;
        this.objectMapper = objectMapper;
    }

    // =========================
    // TOP COINS
    // =========================

    @Cacheable(value = "topCoins", key = "#currency + '-' + #perPage")
    public String getTopCoins(String currency, int perPage) {

        String url = "https://api.coingecko.com/api/v3/coins/markets"
                + "?vs_currency=" + currency
                + "&order=market_cap_desc"
                + "&per_page=" + perPage
                + "&page=1";

        try {
            return restTemplate.getForObject(url, String.class);
        } catch (Exception e) {
            System.out.println("⚠ Error fetching top coins");
            return "[]";
        }
    }

    // =========================
    // CHART DATA
    // =========================

    @Cacheable(value = "chartData", key = "#coinId + '-' + #currency + '-' + #days")
    public List<?> getChartData(String coinId, String currency, int days) {

        String url = "https://api.coingecko.com/api/v3/coins/"
                + coinId
                + "/market_chart?vs_currency="
                + currency
                + "&days="
                + days;

        try {

            String response = restTemplate.getForObject(url, String.class);

            JsonNode root = objectMapper.readTree(response);

            JsonNode prices = root.get("prices");

            return objectMapper.convertValue(prices, List.class);

        } catch (Exception e) {

            System.out.println("⚠ Chart API failed");

            return new ArrayList<>();
        }
    }


    // =========================
    // MULTIPLE LIVE PRICES
    // =========================

    @Cacheable(value = "livePrices", key = "#coinIds + '-' + #currency")
    public JsonNode getMultipleLivePrices(String coinIds, String currency) {

        String url = "https://api.coingecko.com/api/v3/simple/price"
                + "?ids=" + coinIds
                + "&vs_currencies=" + currency;

        System.out.println("API URL: " + url);

        try {

            String response = restTemplate.getForObject(url, String.class);

            System.out.println("API RESPONSE: " + response);

            if (response == null || response.isEmpty()) {

                System.out.println("⚠ Empty response from CoinGecko");

                return objectMapper.createObjectNode();
            }

            return objectMapper.readTree(response);

        } catch (Exception e) {

            System.out.println("⚠ CoinGecko API limit reached or error occurred");

            return objectMapper.createObjectNode();
        }
    }

    // =========================
    // SINGLE LIVE PRICE
    // =========================

    public double getLivePrice(String symbol) {

        String coinId = convertSymbolToCoinId(symbol);

        String url = "https://api.coingecko.com/api/v3/simple/price"
                + "?ids=" + coinId
                + "&vs_currencies=usd";

        try {

            JsonNode response = restTemplate.getForObject(url, JsonNode.class);

            if (response == null || !response.has(coinId)) {

                System.out.println("⚠ Coin not found in API response: " + coinId);

                return 0;
            }

            JsonNode coinNode = response.get(coinId);

            if (!coinNode.has("usd")) {

                System.out.println("⚠ USD price not available");

                return 0;
            }

            return coinNode.get("usd").asDouble();

        } catch (Exception e) {

            System.out.println("⚠ Failed to fetch live price");

            return 0;
        }
    }

    // =========================
    // SYMBOL → COINGECKO ID
    // =========================

    private String convertSymbolToCoinId(String symbol) {

        switch (symbol.toUpperCase()) {

            case "BTC": return "bitcoin";
            case "ETH": return "ethereum";
            case "SOL": return "solana";
            case "BNB": return "binancecoin";
            case "ADA": return "cardano";
            case "XRP": return "ripple";
            case "DOGE": return "dogecoin";
            case "DOT": return "polkadot";
            case "MATIC": return "matic-network";
            case "LTC": return "litecoin";
            case "TRX": return "tron";
            case "USDT": return "tether";

            default:
                return symbol.toLowerCase();
        }
    }
}
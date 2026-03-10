package demo.Crypto_Portfolio.app.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import demo.Crypto_Portfolio.app.model.ExchangeDTO;

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
    // EXCHANGE DATA
    // =========================

    @Cacheable(value = "exchangeData", key = "#coinId")
    public List<ExchangeDTO> getExchangeDetails(String coinId) {

        String url = "https://api.coingecko.com/api/v3/coins/"
                + coinId + "/tickers";

        try {

            String response = restTemplate.getForObject(url, String.class);

            JsonNode root = objectMapper.readTree(response);

            JsonNode tickers = root.get("tickers");

            List<ExchangeDTO> exchangeList = new ArrayList<>();

            if (tickers != null && tickers.isArray()) {

                int limit = Math.min(5, tickers.size());

                for (int i = 0; i < limit; i++) {

                    JsonNode ticker = tickers.get(i);

                    String trustScore =
                            ticker.has("trust_score") && !ticker.get("trust_score").isNull()
                                    ? ticker.get("trust_score").asText()
                                    : "unknown";

                    exchangeList.add(new ExchangeDTO(
                            ticker.get("market").get("name").asText(),
                            ticker.get("base").asText() + "/" + ticker.get("target").asText(),
                            ticker.get("last").asDouble(),
                            ticker.get("volume").asDouble(),
                            trustScore
                    ));
                }
            }

            return exchangeList;

        } catch (Exception e) {

            System.out.println("⚠ Exchange API failed");

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
}
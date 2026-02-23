package demo.Crypto_Portfolio.app.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.ArrayList;
import java.util.List;

import demo.Crypto_Portfolio.app.model.ExchangeDTO;


import java.util.List;

@Service
public class CryptoService {

    private final RestTemplate restTemplate;
    private final ObjectMapper objectMapper;

    public CryptoService(RestTemplate restTemplate, ObjectMapper objectMapper) {
        this.restTemplate = restTemplate;
        this.objectMapper = objectMapper;
    }

    // TOP COINS

    public String getTopCoins(String currency, int perPage) {

        String url = "https://api.coingecko.com/api/v3/coins/markets"
                + "?vs_currency=" + currency
                + "&order=market_cap_desc"
                + "&per_page=" + perPage
                + "&page=1"
                + "&price_change_percentage=1h,24h,7d";

        return restTemplate.getForObject(url, String.class);
    }

    // CHART DATA

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
            throw new RuntimeException("Error fetching chart data", e);
        }
    }
    // EXCHANGE & TRADE DETAILS
    public List<ExchangeDTO> getExchangeDetails(String coinId) {

        String url = "https://api.coingecko.com/api/v3/coins/"
                + coinId + "/tickers";

        try {
            String response = restTemplate.getForObject(url, String.class);
            JsonNode root = objectMapper.readTree(response);
            JsonNode tickers = root.get("tickers");
            if (tickers == null || !tickers.isArray()) {
                return new ArrayList<>();
            }

            List<ExchangeDTO> exchangeList = new ArrayList<>();

            int limit = Math.min(5, tickers.size()); // Top 5 only

            for (int i = 0; i < limit; i++) {

                JsonNode ticker = tickers.get(i);

                String exchangeName = ticker.get("market").get("name").asText();
                String base = ticker.get("base").asText();
                String target = ticker.get("target").asText();
                double lastPrice = ticker.get("last").asDouble();
                double volume = ticker.get("volume").asDouble();
                String trustScore = ticker.get("trust_score").asText();

                String pair = base + "/" + target;

                exchangeList.add(new ExchangeDTO(
                        exchangeName,
                        pair,
                        lastPrice,
                        volume,
                        trustScore
                ));
            }

            return exchangeList;

        } catch (Exception e) {
            throw new RuntimeException("Error fetching exchange data", e);
        }
    }

}


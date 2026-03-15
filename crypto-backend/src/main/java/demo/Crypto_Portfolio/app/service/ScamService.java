package demo.Crypto_Portfolio.app.service;

import com.fasterxml.jackson.databind.JsonNode;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import org.springframework.http.ResponseEntity;

@Service
public class ScamService {

    private final RestTemplate restTemplate = new RestTemplate();

    public boolean isScamToken(String contractAddress){

        try{

            String url =
                    "https://api.gopluslabs.io/api/v1/token_security/1?contract_addresses=" + contractAddress;

            JsonNode response =
                    restTemplate.getForObject(url, JsonNode.class);

            JsonNode token =
                    response.get("result").get(contractAddress);

            if(token == null) return false;

            if(token.get("is_honeypot").asText().equals("1"))
                return true;

            if(token.get("is_blacklisted").asText().equals("1"))
                return true;

        }catch(Exception e){
            System.out.println("Scam API error: " + e.getMessage());
        }

        return false;
    }
}
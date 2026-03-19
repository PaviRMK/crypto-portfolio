package demo.Crypto_Portfolio.app.service;

import demo.Crypto_Portfolio.app.repository.ScamTokenRepository;
import org.springframework.stereotype.Service;

@Service
public class ScamService {

    private final ScamTokenRepository scamTokenRepository;

    public ScamService(ScamTokenRepository scamTokenRepository) {
        this.scamTokenRepository = scamTokenRepository;
    }

    public boolean isScamToken(String contractAddress) {

        // ✅ Safety check (very important)
        if (contractAddress == null || contractAddress.trim().isEmpty()) {
            return false;
        }

        // ✅ Normalize (optional but good practice)
        String normalizedAddress = contractAddress.trim().toLowerCase();

        return scamTokenRepository
                .findByContractAddress(normalizedAddress)
                .isPresent();
    }
}
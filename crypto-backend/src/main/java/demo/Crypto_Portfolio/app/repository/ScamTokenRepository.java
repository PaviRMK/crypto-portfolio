package demo.Crypto_Portfolio.app.repository;

import demo.Crypto_Portfolio.app.model.ScamToken;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface ScamTokenRepository extends JpaRepository<ScamToken, Long> {

    Optional<ScamToken> findByContractAddress(String contractAddress);

}
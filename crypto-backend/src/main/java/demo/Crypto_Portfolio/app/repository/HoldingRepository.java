package demo.Crypto_Portfolio.app.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import demo.Crypto_Portfolio.app.model.Holding;

import java.util.Optional;
import java.util.List;

public interface HoldingRepository extends JpaRepository<Holding, Long> {

    Optional<Holding> findByUserIdAndAssetSymbol(Long userId, String assetSymbol);

    List<Holding> findByUserId(Long userId);
}
package demo.Crypto_Portfolio.app.repository;

import demo.Crypto_Portfolio.app.model.PriceSnapshot;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface PriceSnapshotRepository extends JpaRepository<PriceSnapshot, Long> {

    List<PriceSnapshot> findByCoinSymbolOrderByTimestampDesc(String coinSymbol);

}
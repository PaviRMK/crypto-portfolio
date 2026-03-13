package demo.Crypto_Portfolio.app.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import demo.Crypto_Portfolio.app.model.PriceSnapshot;

import java.util.List;

public interface PriceSnapshotRepository extends JpaRepository<PriceSnapshot, Long> {

    List<PriceSnapshot> findByCoinSymbolOrderByTimestampAsc(String coinSymbol);

}
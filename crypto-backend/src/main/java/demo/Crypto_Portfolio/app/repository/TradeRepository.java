package demo.Crypto_Portfolio.app.repository;

import demo.Crypto_Portfolio.app.model.Trade;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface TradeRepository extends JpaRepository<Trade, Long> {

    List<Trade> findByUserId(Long userId);
}
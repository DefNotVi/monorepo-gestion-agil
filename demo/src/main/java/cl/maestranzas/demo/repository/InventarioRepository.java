package cl.maestranzas.demo.repository;

import cl.maestranzas.demo.model.Inventario;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.Optional;

@Repository
public interface InventarioRepository extends JpaRepository<Inventario, Long> {
    Optional<Inventario> findByNumeroSerie(String numeroSerie);
}

package cl.maestranzas.demo.controller;


import cl.maestranzas.demo.model.Inventario;
import cl.maestranzas.demo.repository.InventarioRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import org.springframework.http.ResponseEntity;

import java.util.List;

@RestController
@RequestMapping("/api/Inventarios")
@CrossOrigin(origins = "*") // Permite la conexión con React
public class InventarioController {

    @Autowired
    private InventarioRepository repository;

    // HU01 & HU02: Obtener todos los Inventarios
    @GetMapping
    public List<Inventario> getAll() {
        return repository.findAll();
    }

@PostMapping
    public ResponseEntity<?> create(@RequestBody Inventario inventario) {
        // Validar si el número de serie ya está registrado
        if (repository.findByNumeroSerie(inventario.getNumeroSerie()).isPresent()) {
            return ResponseEntity.badRequest().body("El número de serie '" + inventario.getNumeroSerie() + "' ya existe en el inventario.");
        }
        
        Inventario nuevoInventario = repository.save(inventario);
        return ResponseEntity.ok(nuevoInventario);
    }

    // HU03: Simular movimiento (Sumar o restar stock)
    @PutMapping("/{id}/movimiento")
    public Inventario registrarMovimiento(@PathVariable Long id, @RequestParam int cantidad) {
        Inventario comp = repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Inventario no encontrado"));
        
        comp.setStockActual(comp.getStockActual() + cantidad);
        return repository.save(comp);
    }
}

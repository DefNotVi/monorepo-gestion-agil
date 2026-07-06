package cl.maestranzas.demo.controller;


import cl.maestranzas.demo.model.Inventario;
import cl.maestranzas.demo.repository.InventarioRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

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

    // HU01: Registrar un nuevo Inventario
    @PostMapping
    public Inventario create(@RequestBody Inventario Inventario) {
        return repository.save(Inventario);
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

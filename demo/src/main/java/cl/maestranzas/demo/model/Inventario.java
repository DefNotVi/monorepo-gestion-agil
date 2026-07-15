package cl.maestranzas.demo.model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Column;

@Entity
public class Inventario {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @Column(unique = true, nullable = false) // 👈 Esto evita duplicados en BD
    private String numeroSerie;
    private String nombre;
    private String ubicacion;
    private int stockActual;
    private int stockMinimo; // Para la HU02 (Alertas)

    // Constructores, Getters y Setters
    public Inventario() {}

    public Inventario(String numeroSerie, String nombre, String ubicacion, int stockActual, int stockMinimo) {
        this.numeroSerie = numeroSerie;
        this.nombre = nombre;
        this.ubicacion = ubicacion;
        this.stockActual = stockActual;
        this.stockMinimo = stockMinimo;
    }

    public Long getId() { return id; }
    public String getNumeroSerie() { return numeroSerie; }
    public void setNumeroSerie(String numeroSerie) { this.numeroSerie = numeroSerie; }
    public String getNombre() { return nombre; }
    public void setNombre(String nombre) { this.nombre = nombre; }
    public String getUbicacion() { return ubicacion; }
    public void setUbicacion(String ubicacion) { this.ubicacion = ubicacion; }
    public int getStockActual() { return stockActual; }
    public void setStockActual(int stockActual) { this.stockActual = stockActual; }
    public int getStockMinimo() { return stockMinimo; }
    public void setStockMinimo(int stockMinimo) { this.stockMinimo = stockMinimo; }
}

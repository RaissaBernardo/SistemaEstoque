package com.indigo.estoque.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.Size;
import lombok.*;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "resina")
@Getter
@Setter
@ToString
@NoArgsConstructor
@AllArgsConstructor
public class Resina {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(columnDefinition = "INT")
    private Long id;

    @Column(nullable = false, length = 100)
    private String nome;

    @Column(nullable = false, length = 50)
    private String cor;

    @Column(nullable = false)
    private LocalDate dataValidade;

    @Column(nullable = true)
    private int minimo;

    @Column(nullable = true)
    private int maximo;

    @ElementCollection
    @CollectionTable(name = "pote_pesos", joinColumns = @JoinColumn(name = "resina_id"))
    @Column(name = "peso_pote", nullable = false)
    private List<Double> pesosPotes = new ArrayList<>(); // Inicializa como lista vazia

    @ElementCollection
    @CollectionTable(name = "pote_compras", joinColumns = @JoinColumn(name = "resina_id"))
    @Column(name = "url_compra", length = 1000, nullable = false)
    @Size(max = 1000, message = "O link de compra não pode ter mais que 1000 caracteres")
    private List<@Size(max = 1000) String> compras = new ArrayList<>();

    @ElementCollection
    @CollectionTable(name = "pote_imagens", joinColumns = @JoinColumn(name = "resina_id"))
    @Column(name = "url_imagem", length = 1000, nullable = false)
    @Size(max = 1000, message = "O link da imagem não pode ter mais que 1000 caracteres")
    private List<@Size(max = 1000) String> imagens = new ArrayList<>();

    @Column(nullable = false)
    private int quantidadePotes;

    @Column(nullable = false)
    private Double totalPesos; // Novo campo para somar os pesos, como em Produto

    public void atualizarQuantidadePotes() {
        if (pesosPotes == null) {
            pesosPotes = new ArrayList<>();
        }

        if (!pesosPotes.isEmpty()) {
            this.quantidadePotes = pesosPotes.size();
            this.totalPesos = pesosPotes.stream().mapToDouble(Double::doubleValue).sum();
        } else {
            this.quantidadePotes = 0;
            this.totalPesos = 0.0;
        }
    }

}
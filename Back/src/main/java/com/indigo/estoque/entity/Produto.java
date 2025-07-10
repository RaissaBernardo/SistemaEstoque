package com.indigo.estoque.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.Size;
import lombok.*;

import java.util.List;

@Entity
@Table(name = "produtos")
@Getter
@Setter
@ToString
@NoArgsConstructor
@AllArgsConstructor
public class Produto {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(columnDefinition = "INT")
    private Long id;

    @Column(nullable = false, length = 100)
    private String nome;

    @Column(nullable = false, length = 50)
    private String cor;

    @Column(nullable = false, length = 100)
    private String fabricante;

    @Column(nullable = false)
    private Double gramas;

    @Column(nullable = false)
    private Double preco;

    @Column(nullable = false)
    private int quantidadeRolos;

    @Column(nullable = true)
    private int minimo;

    @Column(nullable = true)
    private int maximo;

    @ElementCollection
    @CollectionTable(name = "link_compra", joinColumns = @JoinColumn(name = "produto_id"))
    @Column(name = "url_compra", length = 1000, nullable = false)
    @Size(max = 1000, message = "O link de compra não pode ter mais que 1000 caracteres")
    private List<@Size(max = 1000) String> compras;

    @ElementCollection
    @CollectionTable(name = "produto_imagens", joinColumns = @JoinColumn(name = "produto_id"))
    @Column(name = "url_imagem", length = 1000, nullable = false)
    @Size(max = 1000, message = "O link da imagem não pode ter mais que 1000 caracteres")
    private List<@Size(max = 1000) String> imagens;

    // Novo campo para armazenar os pesos dos rolos
    @ElementCollection
    @CollectionTable(name = "produto_rolos", joinColumns = @JoinColumn(name = "produto_id"))
    @Column(name = "peso_rolo", nullable = false)
    private List<Double> rolosPesos;

    // Método para calcular a soma dos pesos dos rolos
    public void atualizarGramas() {
        if (rolosPesos != null && !rolosPesos.isEmpty()) {
            this.gramas = rolosPesos.stream().mapToDouble(Double::doubleValue).sum();
            this.quantidadeRolos = rolosPesos.size();
        } else {
            this.gramas = 0.0;
            this.quantidadeRolos = 0;
        }
    }
}
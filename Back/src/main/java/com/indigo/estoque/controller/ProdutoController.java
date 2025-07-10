package com.indigo.estoque.controller;

import com.indigo.estoque.entity.Produto;
import com.indigo.estoque.entity.Resina;
import com.indigo.estoque.service.EmailService;
import com.indigo.estoque.service.ProdutoService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.*;

@RestController
@RequestMapping("/api/produtos")
public class ProdutoController {

    private final ProdutoService produtoService;
    private final EmailService emailService;

    public ProdutoController(ProdutoService produtoService, EmailService emailService) {
        this.produtoService = produtoService;
        this.emailService = emailService;
    }

    // Cadastrar novo produto
    @PostMapping
    public ResponseEntity<Produto> cadastrarProduto(@RequestBody Produto produto) {
        Produto novoProduto = produtoService.cadastrarProduto(produto);
        return new ResponseEntity<>(novoProduto, HttpStatus.CREATED);
    }

    // Listar todos os produtos
    @GetMapping
    public ResponseEntity<List<Produto>> listarTodosProdutos() {
        List<Produto> produtos = produtoService.listarTodosProdutos();
        return new ResponseEntity<>(produtos, HttpStatus.OK);
    }

    // Buscar produto por ID
    @GetMapping("/{id}")
    public ResponseEntity<Produto> buscarProdutoPorId(@PathVariable Long id) {
        Optional<Produto> produto = produtoService.buscarProdutoPorId(id);
        return produto.map(value -> new ResponseEntity<>(value, HttpStatus.OK))
                .orElseGet(() -> new ResponseEntity<>(HttpStatus.NOT_FOUND));
    }

    @PutMapping("/nome/{nomeOriginal}")
    public ResponseEntity<?> atualizarProdutoPorNome(@PathVariable String nomeOriginal, @RequestBody Produto produtoAtualizado) {
        try {
            Optional<Produto> produtoAtualizadoOpt = produtoService.atualizarProdutoPorNome(nomeOriginal, produtoAtualizado);
            if (produtoAtualizadoOpt.isPresent()) {
                return ResponseEntity.ok(produtoAtualizadoOpt.get());
            } else {
                Map<String, String> error = new HashMap<>();
                error.put("mensagem", "Produto com o nome '" + nomeOriginal + "' não encontrado.");
                return new ResponseEntity<>(error, HttpStatus.NOT_FOUND);
            }
        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("mensagem", "Erro interno: " + e.getMessage());
            return new ResponseEntity<>(error, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    // Deletar por nome
    @DeleteMapping("/nome/{nome}")
    public ResponseEntity<Void> deletarProdutoPorNome(@PathVariable String nome) {
        boolean deletado = produtoService.deletarProdutoPorNome(nome);
        return deletado ? new ResponseEntity<>(HttpStatus.NO_CONTENT) : new ResponseEntity<>(HttpStatus.NOT_FOUND);
    }


    //alerts de compra
    @GetMapping("/alertas")
    public ResponseEntity<List<Produto>> getProdutosAbaixoDoMinimo() {
        List<Produto> produtosCriticas = produtoService.listarProdutosAbaixoDoMinimo();
        return ResponseEntity.ok(produtosCriticas);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Produto> atualizarMinimoMaximo(
            @PathVariable Long id,
            @RequestBody Produto atualizacao) {

        Optional<Produto> produtoOptional = produtoService.buscarProdutoPorId(id);

        if (produtoOptional.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        Produto produtoExistente = produtoOptional.get();

        produtoExistente.setMinimo(atualizacao.getMinimo());
        produtoExistente.setMaximo(atualizacao.getMaximo());

        // salvar no banco
        produtoService.salvar(produtoExistente);
        return ResponseEntity.ok(produtoExistente);
    }

    @PostMapping("/{id}/pedido-compra")
    public ResponseEntity<String> pedidoCompra(@PathVariable Long id) {
        Optional<Produto> produtoOpt = produtoService.buscarProdutoPorId(id);
        if (produtoOpt.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        Produto produto = produtoOpt.get();

        try {
            emailService.enviarPedidoCompra(produto.getNome()); // ✅ agora é injetado, sem static
            return ResponseEntity.ok("Pedido de compra enviado para " + produto.getNome());
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Erro ao enviar pedido de compra: " + e.getMessage());
        }
    }
}

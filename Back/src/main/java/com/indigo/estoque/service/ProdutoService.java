package com.indigo.estoque.service;

import com.indigo.estoque.entity.Produto;
import com.indigo.estoque.entity.Resina;
import com.indigo.estoque.repository.ProdutoRepository;
import jakarta.transaction.Transactional;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class ProdutoService {
    private final ProdutoRepository produtoRepository;

    public ProdutoService(ProdutoRepository produtoRepository) {
        this.produtoRepository = produtoRepository;
    }

    @Transactional
    public Produto cadastrarProduto(Produto produto) {
        // Atualiza gramas e quantidade de rolos com base nos pesos dos rolos
        produto.atualizarGramas();
        return produtoRepository.save(produto);
    }

    public List<Produto> listarTodosProdutos() {
        return produtoRepository.findAll();
    }

    public Optional<Produto> buscarProdutoPorId(Long id) {
        return produtoRepository.findById(id);
    }

    @Transactional
    public Optional<Produto> atualizarEstoque(Long id, Double novasGramas) {
        Optional<Produto> produtoExistente = produtoRepository.findById(id);
        if (produtoExistente.isPresent()) {
            Produto produto = produtoExistente.get();
            if (novasGramas >= 0) {
                produto.setGramas(novasGramas);
                return Optional.of(produtoRepository.save(produto));
            }
        }
        return Optional.empty();
    }

    @Transactional
    public Optional<Produto> atualizarProdutoPorNome(String nomeOriginal, Produto produtoAtualizado) {
        Optional<Produto> produtoOpt = produtoRepository.findByNome(nomeOriginal);
        if (produtoOpt.isPresent()) {
            Produto produto = produtoOpt.get();

            produto.setNome(produtoAtualizado.getNome());
            produto.setCor(produtoAtualizado.getCor());
            produto.setFabricante(produtoAtualizado.getFabricante());
            produto.setPreco(produtoAtualizado.getPreco());
            produto.setRolosPesos(produtoAtualizado.getRolosPesos() != null ? produtoAtualizado.getRolosPesos() : List.of());
            produto.setImagens(produtoAtualizado.getImagens() != null ? produtoAtualizado.getImagens() : List.of());
            produto.setCompras(produtoAtualizado.getCompras() != null ? produtoAtualizado.getCompras() : List.of());

            // Atualiza gramas e quantidade de rolos com base nos pesos dos rolos
            produto.atualizarGramas();

            produtoRepository.save(produto);
            return Optional.of(produto);
        }
        return Optional.empty();
    }

    @Transactional
    public boolean deletarProdutoPorNome(String nome) {
        Long deletedCount = produtoRepository.deleteByNome(nome);
        return deletedCount > 0;
    }

    //alets
    public List<Produto> listarProdutosAbaixoDoMinimo() {
        List<Produto> todas = produtoRepository.findAll();
        return todas.stream()
                .filter(produto -> produto.getQuantidadeRolos() <= produto.getMinimo())
                .toList();
    }

    public Produto salvar(Produto produto) {
        return produtoRepository.save(produto);
    }

}
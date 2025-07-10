package com.indigo.estoque.service;

import com.indigo.estoque.entity.Resina;
import com.indigo.estoque.repository.ResinaRepository;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
public class ResinaService {
    private final ResinaRepository resinaRepository;

    @Autowired
    public ResinaService(ResinaRepository resinaRepository) {
        this.resinaRepository = resinaRepository;
    }

    public Resina cadastrarResina(Resina resina) {
        resina.atualizarQuantidadePotes();
        return resinaRepository.save(resina);
    }

    public Optional<Resina> atualizarResinaPorNome(String nomeOriginal, Resina resinaAtualizada) {
        return resinaRepository.findByNome(nomeOriginal).map(resinaExistente -> {
            resinaExistente.setNome(resinaAtualizada.getNome());
            resinaExistente.setCor(resinaAtualizada.getCor());
            resinaExistente.setDataValidade(resinaAtualizada.getDataValidade());
            resinaExistente.setPesosPotes(resinaAtualizada.getPesosPotes());
            resinaExistente.setCompras(resinaAtualizada.getCompras());
            resinaExistente.setImagens(resinaAtualizada.getImagens());
            resinaExistente.atualizarQuantidadePotes();
            return resinaRepository.save(resinaExistente);
        });
    }


    public List<Resina> listarTodasResinas() {
        List<Resina> resinas = resinaRepository.findAll();
        resinas.forEach(Resina::atualizarQuantidadePotes); // Atualiza antes de retornar
        return resinas;
    }

    public Optional<Resina> buscarResinaPorId(Long id) {
        return resinaRepository.findById(id);
    }

    @Transactional
    public Optional<Resina> atualizarEstoque(Long id, Double novasGramas) {
        Optional<Resina> resinaExistente = resinaRepository.findById(id);
        if (resinaExistente.isPresent()) {
            Resina resina = resinaExistente.get();
            if (novasGramas >= 0) {
                resina.setTotalPesos(novasGramas); // Atualiza totalPesos diretamente, se aplicável
                resina.atualizarQuantidadePotes(); // Recalcula com base nos pesos
                return Optional.of(resinaRepository.save(resina));
            }
        }
        return Optional.empty();
    }

    @Transactional
    public boolean deletarResinaPorNome(String nome) {
        Long deletedCount = resinaRepository.deleteByNome(nome);
        return deletedCount > 0;
    }


    //alerts
    public List<Resina> listarResinasAbaixoDoMinimo() {
        List<Resina> todas = resinaRepository.findAll();
        return todas.stream()
                .filter(resina -> resina.getQuantidadePotes() <= resina.getMinimo())
                .toList();
    }

    public Resina salvar(Resina resina) {
        return resinaRepository.save(resina);
    }
}
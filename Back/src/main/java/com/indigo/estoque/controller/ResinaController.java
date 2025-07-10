package com.indigo.estoque.controller;

import com.indigo.estoque.entity.Resina;
import com.indigo.estoque.service.EmailService;
import com.indigo.estoque.service.ResinaService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/resinas")
public class ResinaController {

    private final ResinaService resinaService;
    private final EmailService emailService;

    public ResinaController(ResinaService resinaService, EmailService emailService) {
        this.resinaService = resinaService;
        this.emailService = emailService;
    }

    @PostMapping
    public ResponseEntity<Resina> cadastrarResina(@RequestBody Resina resina) {
        Resina novaResina = resinaService.cadastrarResina(resina);
        return new ResponseEntity<>(novaResina, HttpStatus.CREATED);
    }

    @GetMapping
    public ResponseEntity<List<Resina>> listarTodasResinas() {
        List<Resina> resinas = resinaService.listarTodasResinas();
        return new ResponseEntity<>(resinas, HttpStatus.OK);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Resina> buscarResinaPorId(@PathVariable Long id) {
        Optional<Resina> resina = resinaService.buscarResinaPorId(id);
        return resina.map(value -> new ResponseEntity<>(value, HttpStatus.OK))
                .orElseGet(() -> new ResponseEntity<>(HttpStatus.NOT_FOUND));
    }

    @PutMapping("/nome/{nomeOriginal}")
    public ResponseEntity<?> atualizarResinaPorNome(@PathVariable String nomeOriginal, @RequestBody Resina resinaAtualizada) {
        try {
            Optional<Resina> resinaAtualizadaOpt = resinaService.atualizarResinaPorNome(nomeOriginal, resinaAtualizada);
            if (resinaAtualizadaOpt.isPresent()) {
                return ResponseEntity.ok(resinaAtualizadaOpt.get());
            } else {
                return new ResponseEntity<>(Map.of("mensagem", "Resina com o nome '" + nomeOriginal + "' não encontrada."), HttpStatus.NOT_FOUND);
            }
        } catch (Exception e) {
            return new ResponseEntity<>(Map.of("mensagem", "Erro interno: " + e.getMessage()), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @DeleteMapping("/nome/{nome}")
    public ResponseEntity<Void> deletarResinaPorNome(@PathVariable String nome) {
        boolean deletado = resinaService.deletarResinaPorNome(nome);
        return deletado ? new ResponseEntity<>(HttpStatus.NO_CONTENT) : new ResponseEntity<>(HttpStatus.NOT_FOUND);
    }

    //parte do alerta

    @GetMapping("/alertas")
    public ResponseEntity<List<Resina>> getResinasAbaixoDoMinimo() {
        List<Resina> resinasCriticas = resinaService.listarResinasAbaixoDoMinimo();
        return ResponseEntity.ok(resinasCriticas);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Resina> atualizarMinimoMaximo(
            @PathVariable Long id,
            @RequestBody Resina atualizacao) {

        Optional<Resina> resinaOptional = resinaService.buscarResinaPorId(id);

        if (resinaOptional.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        Resina resinaExistente = resinaOptional.get();

        resinaExistente.setMinimo(atualizacao.getMinimo());
        resinaExistente.setMaximo(atualizacao.getMaximo());

        // salvar no banco
        resinaService.salvar(resinaExistente);
        return ResponseEntity.ok(resinaExistente);
    }

    @PostMapping("/{id}/pedido-compra")
    public ResponseEntity<String> pedidoCompra(@PathVariable Long id) {
        Optional<Resina> resinaOpt = resinaService.buscarResinaPorId(id);
        if (resinaOpt.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        Resina resina = resinaOpt.get();

        try {
            emailService.enviarPedidoCompra(resina.getNome()); // ✅ agora é injetado, sem static
            return ResponseEntity.ok("Pedido de compra enviado para " + resina.getNome());
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Erro ao enviar pedido de compra: " + e.getMessage());
        }
    }
}
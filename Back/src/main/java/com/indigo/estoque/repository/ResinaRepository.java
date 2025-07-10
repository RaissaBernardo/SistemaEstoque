package com.indigo.estoque.repository;

import com.indigo.estoque.entity.Resina;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface ResinaRepository extends JpaRepository<Resina, Long> {
    Optional<Resina> findByNome(String nome);
    Long deleteByNome(String nome);
}
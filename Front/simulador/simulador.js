   if (localStorage.getItem("logado") !== "true") {
    window.location.href = "index.html";
  }

    function logout() {
    localStorage.removeItem("logado");
    window.location.href = "index.html";
  }
 
 const apiResinas = "http://localhost:8080/api/resinas";
    const apiProdutos = "http://localhost:8080/api/produtos";

    let resinasData = [];
    let produtosData = [];

    function carregarSimulacaoInsumos() {
      fetch(apiResinas)
        .then(resp => resp.json())
        .then(resinas => {
          resinasData = resinas;
          const nomesUnicos = [...new Set(resinas.map(r => r.nome))];
          const selectNome = document.getElementById("select-resina-nome");
          nomesUnicos.forEach(nome => {
            const opt = document.createElement("option");
            opt.value = nome;
            opt.textContent = nome;
            selectNome.appendChild(opt);
          });
        });

      fetch(apiProdutos)
        .then(resp => resp.json())
        .then(produtos => {
          produtosData = produtos;
          const nomesUnicos = [...new Set(produtos.map(p => p.nome))];
          const selectNome = document.getElementById("select-produto-nome");
          nomesUnicos.forEach(nome => {
            const opt = document.createElement("option");
            opt.value = nome;
            opt.textContent = nome;
            selectNome.appendChild(opt);
          });
        });
    }

    document.getElementById("select-resina-nome").addEventListener("change", function() {
      const corSelect = document.getElementById("select-resina-cor");
      corSelect.innerHTML = '<option value="">Selecione a cor</option>';
      const selecionado = this.value;
      const cores = resinasData.filter(r => r.nome === selecionado).map(r => r.cor);
      [...new Set(cores)].forEach(cor => {
        const opt = document.createElement("option");
        opt.value = cor;
        opt.textContent = cor;
        corSelect.appendChild(opt);
      });
    });

    document.getElementById("select-produto-nome").addEventListener("change", function() {
      const corSelect = document.getElementById("select-produto-cor");
      corSelect.innerHTML = '<option value="">Selecione a cor</option>';
      const selecionado = this.value;
      const cores = produtosData.filter(p => p.nome === selecionado).map(p => p.cor);
      [...new Set(cores)].forEach(cor => {
        const opt = document.createElement("option");
        opt.value = cor;
        opt.textContent = cor;
        corSelect.appendChild(opt);
      });
    });

    function simularResina() {
      const nome = document.getElementById("select-resina-nome").value;
      const cor = document.getElementById("select-resina-cor").value;
      const consumo = Number(document.getElementById("resina-consumo").value);
      const item = resinasData.find(r => r.nome === nome && r.cor === cor);
      if (!item) return;
      const estoque = item.totalPesos;
      const resultado = estoque - consumo;
      const resDiv = document.getElementById("resina-resultado");
      document.getElementById("resina-estoque").textContent = `Estoque atual: ${estoque.toFixed(2)}g`;
      gerarRespostaSimulacao(resultado, resDiv, apiResinas, item.id);
    }

    function simularProduto() {
      const nome = document.getElementById("select-produto-nome").value;
      const cor = document.getElementById("select-produto-cor").value;
      const consumo = Number(document.getElementById("produto-consumo").value);
      const item = produtosData.find(p => p.nome === nome && p.cor === cor);
      if (!item) return;
      const estoque = item.gramas;
      const resultado = estoque - consumo;
      const resDiv = document.getElementById("produto-resultado");
      document.getElementById("produto-estoque").textContent = `Estoque atual: ${estoque.toFixed(2)}g`;
      gerarRespostaSimulacao(resultado, resDiv, apiProdutos, item.id);
    }

    function gerarRespostaSimulacao(resultado, resDiv, api, id) {
      if (resultado < 0) {
        resDiv.innerHTML = `<p style='color:red;'>Estoque insuficiente! Faltam ${Math.abs(resultado).toFixed(2)}g.</p>
        <button class='btn' onclick="fazerPedido('${api}', ${id})">Fazer pedido de compra</button>`;
      } else if (resultado < 200) {
        Swal.fire({
          icon: 'warning',
          title: 'Estoque Baixo!',
          text: `Com o consumo, o estoque será reduzido e ficará com apenas ${resultado.toFixed(2)}g. Faça um pedido de compra para evitar futuras frustações.`
        });
        resDiv.innerHTML = `<p style='color:orange;'>Consumo possível, mas o estoque futuro será baixo (${resultado.toFixed(2)}g).</p>
        <button class='btn' onclick="fazerPedido('${api}', ${id})">Fazer pedido de compra</button>`;
      } else {
        resDiv.innerHTML = `<p style='color:green;'>Estoque restante: ${resultado.toFixed(2)}g</p>`;
      }
    }

    function fazerPedido(api, id) {
      fetch(`${api}/${id}/pedido-compra`, { method: "POST" })
        .then(resp => {
          if (!resp.ok) throw new Error("Erro ao enviar pedido");
          return resp.text();
        })
        .then(msg => {
          Swal.fire({ icon: 'success', title: 'Pedido enviado!', text: msg });
        })
        .catch(err => {
          Swal.fire({ icon: 'error', title: 'Erro', text: err.message });
        });
    }

    window.onload = carregarSimulacaoInsumos;

function toggleMenu() {
  const sidebar = document.getElementById('sidebar');
  sidebar.classList.toggle('open');
}
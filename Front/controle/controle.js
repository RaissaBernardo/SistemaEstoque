  if (localStorage.getItem("logado") !== "true") {
    window.location.href = "index.html";
  }

let isLoggedIn = false;

function fazerLogin() {
  const username = document.getElementById('login-username').value.trim();
  const password = document.getElementById('login-password').value.trim();
  const errorMessage = document.getElementById('error-login');

  if ((username === 'Leonardo Moreira' || username === 'Mauro Junior') && password === 'controleEstoque') {
    isLoggedIn = true;
    document.getElementById('login-section').style.display = 'none';
    document.querySelector('.search-bar').style.display = 'flex';
    mostrarTabelas();
    carregarResinas();
    carregarProdutos();
  } else {
    errorMessage.textContent = 'Usuário ou senha inválidos.';
  }
}

document.getElementById("login-password").addEventListener("keydown", function(event) {
  if (event.key === "Enter") {
    fazerLogin();
  }
});

function mostrarTabelas() {
  document.querySelector("#tabela-resinas").parentElement.style.display = 'block';
  document.querySelector("#tabela-produtos").parentElement.style.display = 'block';
}

function esconderTabelas() {
  document.querySelector("#tabela-resinas").parentElement.style.display = 'none';
  document.querySelector("#tabela-produtos").parentElement.style.display = 'none';
}

function buscarProdutoPorNome() {
  if (!isLoggedIn) {
    alert('Faça login para usar a busca.');
    return;
  }

  const termoBusca = document.getElementById('busca-nome').value.toLowerCase();

  // Busca nas resinas
  fetch("http://localhost:8080/api/resinas")
    .then(resp => resp.json())
    .then(resinas => {
      const tbody = document.querySelector("#tabela-resinas tbody");
      tbody.innerHTML = "";
      const filtradas = resinas.filter(r => r.nome.toLowerCase().includes(termoBusca));
      filtradas.forEach(resina => tbody.appendChild(criarLinha(resina, true)));
    })
    .catch(() => alert("Erro ao carregar resinas"));

  // Busca nos produtos
  fetch("http://localhost:8080/api/produtos")
    .then(resp => resp.json())
    .then(produtos => {
      const tbody = document.querySelector("#tabela-produtos tbody");
      tbody.innerHTML = "";
      const filtrados = produtos.filter(p => p.nome.toLowerCase().includes(termoBusca));
      filtrados.forEach(produto => tbody.appendChild(criarLinha(produto, false)));
    })
    .catch(() => alert("Erro ao carregar produtos"));
}

const apiResinas = "http://localhost:8080/api/resinas";
const apiProdutos = "http://localhost:8080/api/produtos";

function criarLinha(item, isResina = true) {
  const tr = document.createElement("tr");

  const pesoAtual = isResina ? item.totalPesos : item.gramas;

  const statusTexto = pesoAtual >= item.minimo && pesoAtual <= item.maximo
    ? "Dentro do padrão"
    : "Fora do padrão";

  tr.innerHTML = `
    <td>${item.nome}</td>
    <td>${(typeof pesoAtual === "number" ? pesoAtual.toFixed(2) : "0.00")}</td>
    <td><input type="number" min="0" value="${item.minimo}" /></td>
    <td><input type="number" min="0" value="${item.maximo}" /></td>
    <td class="status">${statusTexto}</td>
    <td>
      <button class="salvar-btn">Salvar</button>
      <button class="pedido-btn">Pedido de Compra</button>
      <div class="msg"></div>
    </td>
  `;

  const btnSalvar = tr.querySelector(".salvar-btn");
  const btnPedido = tr.querySelector(".pedido-btn");
  const inputMin = tr.querySelectorAll("input")[0];
  const inputMax = tr.querySelectorAll("input")[1];
  const msgDiv = tr.querySelector(".msg");
  const statusTd = tr.querySelector(".status");

  const apiBase = isResina ? apiResinas : apiProdutos;

  btnSalvar.addEventListener("click", () => {
    const novoMin = Number(inputMin.value);
    const novoMax = Number(inputMax.value);

    btnSalvar.disabled = true;
    msgDiv.textContent = "";

    fetch(`${apiBase}/${item.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ minimo: novoMin, maximo: novoMax })
    })
      .then(resp => {
        if (!resp.ok) throw new Error("Erro ao salvar");
        return resp.json();
      })
      .then(() => {
        msgDiv.textContent = "Salvo com sucesso!";
        msgDiv.className = "msg sucesso";

        const novoStatus = (pesoAtual >= novoMin && pesoAtual <= novoMax)
          ? "Dentro do padrão"
          : "Fora do padrão";
        statusTd.textContent = novoStatus;
      })
      .catch(err => {
        msgDiv.textContent = err.message;
        msgDiv.className = "msg erro";
      })
      .finally(() => {
        btnSalvar.disabled = false;
      });
  });

  btnPedido.addEventListener("click", () => {
    btnPedido.disabled = true;
    msgDiv.textContent = "";

    fetch(`${apiBase}/${item.id}/pedido-compra`, { method: "POST" })
      .then(resp => {
        if (!resp.ok) throw new Error("Erro ao enviar pedido de compra");
        return resp.text();
      })
      .then(msg => {
        msgDiv.textContent = msg;
        msgDiv.className = "msg sucesso";
      })
      .catch(err => {
        msgDiv.textContent = err.message;
        msgDiv.className = "msg erro";
      })
      .finally(() => {
        btnPedido.disabled = false;
      });
  });

  return tr;
}

function carregarResinas() {
  fetch(apiResinas)
    .then(resp => resp.json())
    .then(resinas => {
      const tbody = document.querySelector("#tabela-resinas tbody");
      tbody.innerHTML = "";
      resinas.forEach(resina => tbody.appendChild(criarLinha(resina, true)));
    })
    .catch(err => {
      alert("Erro ao carregar resinas");
      console.error(err);
    });
}

function carregarProdutos() {
  fetch(apiProdutos)
    .then(resp => resp.json())
    .then(produtos => {
      const tbody = document.querySelector("#tabela-produtos tbody");
      tbody.innerHTML = "";
      produtos.forEach(produto => tbody.appendChild(criarLinha(produto, false)));
    })
    .catch(err => {
      alert("Erro ao carregar produtos");
      console.error(err);
    });
}

// ✅ Correto agora! Só um window.onload
window.onload = () => {
  esconderTabelas();
  document.querySelector('.search-bar').style.display = 'none';
};


function toggleMenu() {
  const sidebar = document.getElementById('sidebar');
  sidebar.classList.toggle('open');
}

document.addEventListener('DOMContentLoaded', () => {
      const sidebar = document.getElementById('sidebar');
      sidebar.classList.remove('open');
      console.log("Sidebar inicializado como fechado");
});

  function logout() {
    localStorage.removeItem("logado");
    window.location.href = "index.html";
  }
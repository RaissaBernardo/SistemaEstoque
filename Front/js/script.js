function toggleMenu() {
  const sidebar = document.getElementById('sidebar');
  sidebar.classList.toggle('open');
}

  function logout() {
    localStorage.removeItem("logado");
    window.location.href = "index.html";
  }

if (localStorage.getItem("logado") !== "true") {
    window.location.href = "index.html";
  }

function buscarProdutoPorNome() {
  const nomeBuscado = document.getElementById('busca-nome').value.trim().toLowerCase();
  fetch('http://localhost:8080/api/produtos')
    .then(response => response.json())
    .then(produtos => {
      const filtrados = nomeBuscado
        ? produtos.filter(p => p.nome.toLowerCase().includes(nomeBuscado))
        : produtos;
      exibirProdutos(filtrados);
    })
    .catch(error => console.error('Erro ao buscar produtos:', error));
}

function exibirProdutos(produtos) {
  const container = document.getElementById('produtos-container');
  container.innerHTML = '';

  if (produtos.length === 0) {
    container.innerHTML = '<p>Nenhum produto encontrado.</p>';
    return;
  }

  produtos.forEach(produto => {
    const card = document.createElement('div');
    card.classList.add('produto');
    const imagem = produto.imagens && produto.imagens.length > 0
      ? `<img src="${produto.imagens[0]}" alt="${produto.nome}" class="produto-imagem">`
      : `<div class="sem-imagem">Sem imagem</div>`;
    card.innerHTML = `
      ${imagem}
      <h3>${produto.nome}</h3>
      <p><strong>Cor:</strong> ${produto.cor}</p>
      <p><strong>Fabricante:</strong> ${produto.fabricante}</p>
      <p><strong>Gramas disponíveis:</strong> ${produto.gramas}</p>
    `;
    container.appendChild(card);
  });
}

function toggleMenu() {
      const sidebar = document.getElementById('sidebar');
      sidebar.classList.toggle('open');
      console.log("Sidebar toggled:", sidebar.classList.contains("open") ? "Open" : "Closed");
    }

    document.addEventListener('DOMContentLoaded', () => {
      const sidebar = document.getElementById('sidebar');
      sidebar.classList.remove('open');
      console.log("Sidebar inicializado como fechado");
    });

document.addEventListener('DOMContentLoaded', () => {
  buscarProdutoPorNome();
  const campoBusca = document.getElementById('busca-nome');
  if (campoBusca) {
    campoBusca.addEventListener('input', buscarProdutoPorNome);
  }
});
function toggleMenu() {
  const sidebar = document.getElementById('sidebar');
  sidebar.classList.toggle('open');
}

  if (localStorage.getItem("logado") !== "true") {
    window.location.href = "index.html";
  }

    function logout() {
    localStorage.removeItem("logado");
    window.location.href = "index.html";
  }

function buscarResinaPorNome() {
  const nomeBuscado = document.getElementById('busca-nome').value.trim().toLowerCase();
  fetch('http://localhost:8080/api/resinas') // rota do backend para resinas
    .then(response => response.json())
    .then(resinas => {
      const filtrados = nomeBuscado
        ? resinas.filter(r => r.nome.toLowerCase().includes(nomeBuscado))
        : resinas;
      exibirResinas(filtrados);
    })
    .catch(error => console.error('Erro ao buscar resinas:', error));
}

function exibirResinas(resinas) {
  const container = document.getElementById('resinas-container');
  container.innerHTML = '';

  if (resinas.length === 0) {
    container.innerHTML = '<p>Nenhuma resina encontrada.</p>';
    return;
  }

  resinas.forEach(resina => {
    const card = document.createElement('div');
    card.classList.add('produto');

    const imagem = resina.imagens && resina.imagens.length > 0
      ? `<img src="${resina.imagens[0]}" alt="${resina.nome}" class="produto-imagem">`
      : `<div class="sem-imagem">Sem imagem</div>`;

    const totalPeso = resina.pesosPotes
      ? resina.pesosPotes.reduce((acc, p) => acc + p, 0)
      : '---';

    const linksCompras = (resina.compras || [])
      .map((url, i) => `<a href="${url}" target="_blank">Comprar ${i + 1}</a>`)
      .join(' ');

    card.innerHTML = `
      ${imagem}
      <h3>${resina.nome}</h3>
      <p><strong>Cor:</strong> ${resina.cor}</p>
      <p><strong>Validade:</strong> ${resina.dataValidade || '---'}</p>
      <p><strong>Peso Total (g):</strong> ${totalPeso}</p>
    `;

    container.appendChild(card);
  });
}

document.addEventListener('DOMContentLoaded', () => {
  const sidebar = document.getElementById('sidebar');
  sidebar.classList.remove('open');
  console.log("Sidebar inicializado como fechado");

  buscarResinaPorNome();

  const campoBusca = document.getElementById('busca-nome');
  if (campoBusca) {
    campoBusca.addEventListener('input', buscarResinaPorNome);
  }
});

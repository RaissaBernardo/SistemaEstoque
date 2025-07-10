let isLoggedIn = false;

function isUrlValida(url) {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
}

  if (localStorage.getItem("logado") !== "true") {
    window.location.href = "index.html";
  }
    function logout() {
    localStorage.removeItem("logado");
    window.location.href = "index.html";
  }

function fazerLogin() {
  const username = document.getElementById('login-username')?.value.trim() || '';
  const password = document.getElementById('login-password')?.value.trim() || '';
  const errorMessage = document.getElementById('error-login');
  const loginSection = document.getElementById('login-section');
  const cadastroSection = document.getElementById('cadastro-section');
  const searchBar = document.querySelector('.search-bar');

  if (!loginSection || !cadastroSection || !searchBar) {
    console.error('Seções necessárias não encontradas.');
    if (errorMessage) errorMessage.textContent = 'Erro: seções da página não encontradas.';
    return;
  }

  if (username === 'admin' && password === 'indigo2025') {
    isLoggedIn = true;
    loginSection.style.display = 'none';
    cadastroSection.style.display = 'block';
    searchBar.style.display = 'flex';
    buscarTodasResinas();
  } else {
    if (errorMessage) {
      errorMessage.textContent = 'Usuário ou senha inválidos.';
    }
  }
}

document.getElementById("login-password").addEventListener("keydown", function(event) {
  if (event.key === "Enter") {
    fazerLogin();
  }
});

function toggleMenu() {
  const sidebar = document.getElementById('sidebar');
  sidebar.classList.toggle('open');
}

document.addEventListener('DOMContentLoaded', () => {
  const loginSection = document.getElementById('login-section');
  const cadastroSection = document.getElementById('cadastro-section');
  const searchBar = document.querySelector('.search-bar');
  const sidebar = document.getElementById('sidebar');

  if (loginSection && cadastroSection && searchBar) {
    if (isLoggedIn) {
      loginSection.style.display = 'none';
      cadastroSection.style.display = 'block';
      searchBar.style.display = 'flex';
      buscarTodasResinas();
    } else {
      loginSection.style.display = 'block';
      cadastroSection.style.display = 'none';
      searchBar.style.display = 'none';
    }
  } else {
    console.error('Seções login-section, cadastro-section ou search-bar não encontradas.');
  }

  if (sidebar) {
    sidebar.classList.remove('open');
    console.log("Sidebar inicializado como fechado");
  }
  atualizarQuantidade();
});

function adicionarCampoImagem() {
  const container = document.getElementById('imagens-container');
  const novoInput = document.createElement('label');
  novoInput.innerHTML = `URL da Imagem:
    <input type="url" class="imagem-url-input" placeholder="https://exemplo.com/imagem.jpg" oninput="previewAllImages()">`;
  container.appendChild(novoInput);
}

function adicionarCampoLink() {
  const container = document.getElementById('compras-container');
  const novoInput = document.createElement('label');
  novoInput.innerHTML = `Link de Compra:
    <input type="url" class="compra-url-input" placeholder="https://exemplo.com/compra.jpg">`;
  container.appendChild(novoInput);
}

function adicionarCampoPote() {
  const container = document.getElementById('potes-pesos-container');
  const index = container.querySelectorAll('.pote-peso-input').length + 1;
  const novoInput = document.createElement('label');
  novoInput.innerHTML = `Peso do Pote (${index}) em gramas:
    <input type="number" class="pote-peso-input" placeholder="Ex: 344" step="0.01" min="0">`;
  container.appendChild(novoInput);
}

function atualizarQuantidade() {
  const quantidadeInputs = document.querySelectorAll('.pote-peso-input');
  const quantidade = quantidadeInputs.length;
  document.getElementById('quantidade').value = quantidade;
}

function previewAllImages() {
  const previewContainer = document.getElementById('preview-container');
  previewContainer.innerHTML = '';
  document.querySelectorAll('.imagem-url-input').forEach(input => {
    const url = input.value.trim();
    if (url && isUrlValida(url)) {
      const img = document.createElement('img');
      img.src = url;
      img.style.maxWidth = '300px';
      img.style.margin = '5px';
      previewContainer.appendChild(img);
    }
  });
}

function previewImagesModal() {
  const previewsContainer = document.getElementById('edit-imagem-preview');
  previewsContainer.innerHTML = '';

  document.querySelectorAll('.imagem-url-input-modal').forEach(input => {
    const url = input.value.trim();
    if (url && isUrlValida(url)) {
      const img = document.createElement('img');
      img.src = url;
      img.alt = 'Prévia da imagem';
      img.classList.add('imagem-preview');
      previewsContainer.appendChild(img);
    }
  });
}


function changeMainImage(clickedThumbnail) {
  const productCard = clickedThumbnail.closest('.product-card');
  const mainImage = productCard.querySelector('.main-image-display .product-image');
  if (mainImage) {
    mainImage.src = clickedThumbnail.src;
    productCard.querySelectorAll('.product-thumbnail').forEach(thumb => {
      thumb.classList.remove('active-thumbnail');
    });
    clickedThumbnail.classList.add('active-thumbnail');
  }
}

function adicionarCampoImagemModal() {
  const imagensContainerModal = document.getElementById('edit-imagens-container');
  const newLabel = document.createElement('label');
  newLabel.innerHTML = `
    URL da Imagem:
    <input type="url" class="imagem-url-input-modal" placeholder="https://exemplo.com/imagem.jpg" oninput="previewImagesModal()">
  `;
  imagensContainerModal.appendChild(newLabel);
  imagensContainerModal.appendChild(document.createElement('br'));
}

function adicionarCampoCompraModal() {
  const comprasContainerModal = document.getElementById('edit-compras-container');
  const newLabel = document.createElement('label');
  newLabel.innerHTML = `
    Link de Compra:
    <input type="url" class="compra-url-input-modal" placeholder="https://exemplo.com/compra">
  `;
  comprasContainerModal.appendChild(newLabel);
  comprasContainerModal.appendChild(document.createElement('br'));
}

function adicionarCampoPoteModal() {
  const potesContainerModal = document.getElementById('edit-potes-container');
  const index = potesContainerModal.querySelectorAll('.pote-peso-input-modal').length + 1;
  const newLabel = document.createElement('label');
  newLabel.innerHTML = `
    Peso do Pote (${index}) em gramas:
    <input type="number" class="pote-peso-input-modal" placeholder="Ex: 250" step="0.01" min="0">
  `;
  potesContainerModal.appendChild(newLabel);
  potesContainerModal.appendChild(document.createElement('br'));
}

function abrirModalEdicao(nomeOriginal, resinaDataBase64) {
  if (!isLoggedIn) {
    Swal.fire({
      icon: 'warning',
      title: 'Atenção!',
      text: 'Faça login para editar resinas.',
      confirmButtonText: 'Ok',
    });
    return;
  }

  try {
    const resinaData = JSON.parse(atob(resinaDataBase64));
    const modal = document.getElementById('editProductModal');
    modal.style.display = 'block';

    document.getElementById('edit-original-nome').value = decodeURIComponent(nomeOriginal);
    document.getElementById('edit-nome').value = resinaData.nome || '';
    document.getElementById('edit-cor').value = resinaData.cor || '';
    document.getElementById('edit-validade').value = resinaData.dataValidade || '';
    document.getElementById('edit-quantidade').value = resinaData.quantidadePotes || '';

    // Imagens
    const imagensContainerModal = document.getElementById('edit-imagens-container');
    imagensContainerModal.innerHTML = '';
    const imagens = (resinaData.imagens && resinaData.imagens.length > 0) ? resinaData.imagens : [''];
    imagens.forEach((url, index) => {
      const newLabel = document.createElement('label');
      newLabel.innerHTML = `
        URL da Imagem (${index + 1}):
        <input type="url" class="imagem-url-input-modal" value="${url}" oninput="previewImagesModal()">
      `;
      imagensContainerModal.appendChild(newLabel);
      imagensContainerModal.appendChild(document.createElement('br'));
    });

    // Links de compra
    const comprasContainerModal = document.getElementById('edit-compras-container');
    comprasContainerModal.innerHTML = '';
    const compras = (resinaData.compras && resinaData.compras.length > 0) ? resinaData.compras : [''];
    compras.forEach((url, index) => {
      const newLabel = document.createElement('label');
      newLabel.innerHTML = `
        Link de Compra (${index + 1}):
        <input type="url" class="compra-url-input-modal" value="${url}">
      `;
      comprasContainerModal.appendChild(newLabel);
      comprasContainerModal.appendChild(document.createElement('br'));
    });

    // Potes
    const potesContainerModal = document.getElementById('edit-potes-container');
    potesContainerModal.innerHTML = '';
    const potes = (resinaData.pesosPotes && resinaData.pesosPotes.length > 0) ? resinaData.pesosPotes : [0];
    potes.forEach((peso, index) => {
      const newLabel = document.createElement('label');
      newLabel.innerHTML = `
        Peso do Pote (${index + 1}) em gramas:
        <input type="number" class="pote-peso-input-modal" value="${peso}" step="0.01" min="0">
      `;
      potesContainerModal.appendChild(newLabel);
      potesContainerModal.appendChild(document.createElement('br'));
    });

    previewImagesModal();

  } catch (e) {
    console.error('Erro ao decodificar dados da resina:', e);
    Swal.fire({
      icon: 'error',
      title: 'Erro!',
      text: 'Falha ao carregar os dados da resina para edição.',
      confirmButtonText: 'Ok',
    });
  }
}


function fecharModal() {
  document.getElementById('editProductModal').style.display = 'none';
}

function atualizarResinaPeloNome() {
  if (!isLoggedIn) {
    Swal.fire({
      icon: 'warning',
      title: 'Atenção!',
      text: 'Faça login para atualizar resinas.',
      confirmButtonText: 'Ok',
    });
    return;
  }

  const nomeOriginal = document.getElementById('edit-original-nome').value.trim();
  const nome = document.getElementById('edit-nome').value.trim();
  const cor = document.getElementById('edit-cor').value.trim();
  const validade = document.getElementById('edit-validade') ? document.getElementById('edit-validade').value.trim() : '';
  const quantidade = parseInt(document.getElementById('edit-quantidade').value.trim(), 10);

  const imagens = [];
  const compras = [];
  const pesosPotes = [];
  let urlInvalida = false;

  // Validar URLs das imagens
  document.querySelectorAll('.imagem-url-input-modal').forEach(input => {
    const url = input.value.trim();
    if (url) {
      if (isUrlValida(url)) {
        imagens.push(url);
      } else {
        urlInvalida = true;
      }
    }
  });

  // Validar URLs dos links de compra
  document.querySelectorAll('.compra-url-input-modal').forEach(input => {
    const url = input.value.trim();
    if (url) {
      if (isUrlValida(url)) {
        compras.push(url);
      } else {
        urlInvalida = true;
      }
    }
  });

  // Pesos dos potes
  document.querySelectorAll('.pote-peso-input-modal').forEach(input => {
    const peso = parseFloat(input.value.trim());
    if (!isNaN(peso) && peso > 0) pesosPotes.push(peso);
  });

  if (!nome || !cor || !validade || urlInvalida || pesosPotes.length === 0) {
    Swal.fire({
      icon: 'warning',
      title: 'Atenção!',
      text: 'Preencha corretamente todos os campos obrigatórios e use URLs válidas.',
      confirmButtonText: 'Ok',
    });
    return;
  }

  const resinaAtualizada = {
    nome,
    cor,
    dataValidade: validade,
    quantidadePotes: pesosPotes.length,
    pesosPotes,
    imagens,
    compras,
  };

  fetch(`http://localhost:8080/api/resinas/nome/${encodeURIComponent(nomeOriginal)}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(resinaAtualizada),
  })
    .then(response => {
      if (response.ok) {
        Swal.fire({
          icon: 'success',
          title: 'Confirmado!',
          text: 'Resina atualizada com sucesso!',
          confirmButtonText: 'Ok',
        });
        fecharModal();
        buscarTodasResinas();
      } else {
        response.json().then(error => {
          Swal.fire({
            icon: 'warning',
            title: 'Erro!',
            text: 'Erro ao atualizar: ' + (error.mensagem || response.statusText),
            confirmButtonText: 'Ok',
          });
        });
      }
    })
    .catch(error => console.error('Erro de rede:', error));
}


function removerResinaPorNome(nome) {
  if (!isLoggedIn) {
    Swal.fire({
      icon: 'warning',
      title: 'Erro!',
      text: 'Faça login para remover resinas.',
      confirmButtonText: 'Ok',
    });
    return;
  }

  const decodedNome = decodeURIComponent(nome);

  Swal.fire({
    title: `Tem certeza que deseja remover a resina com nome: ${decodedNome}?`,
    icon: 'warning',
    showCancelButton: true,
    confirmButtonText: 'Sim, remover',
    cancelButtonText: 'Cancelar',
    reverseButtons: true,
  }).then((result) => {
    if (result.isConfirmed) {
      fetch(`http://localhost:8080/api/resinas/nome/${encodeURIComponent(decodedNome)}`, {
        method: 'DELETE',
      })
        .then(response => {
          if (response.ok) {
            Swal.fire({
              icon: 'success',
              title: 'Confirmado!',
              text: 'Resina removida com sucesso!',
              confirmButtonText: 'Ok',
            });
            buscarTodasResinas();
          } else if (response.status === 404) {
            Swal.fire({
              icon: 'warning',
              title: 'Atenção!',
              text: 'Resina não encontrada.',
              confirmButtonText: 'Ok',
            });
          } else {
            response.json().then(data => {
              Swal.fire({
                icon: 'warning',
                title: 'Atenção!',
                text: 'Erro ao remover: ' + (data.mensagem || response.statusText),
                confirmButtonText: 'Ok',
              });
            }).catch(() => {
              Swal.fire({
                icon: 'warning',
                title: 'Atenção!',
                text: 'Erro ao remover resina.',
                confirmButtonText: 'Ok',
              });
            });
          }
        })
        .catch(error => console.error('Erro:', error));
    }
  });
}


function buscarResinaPorNome() {
  const termo = document.getElementById('busca-nome').value.trim().toLowerCase();

  const resinasFiltradas = resinasDisponiveis.filter(resina =>
    resina.nome.toLowerCase().includes(termo) ||
    resina.cor.toLowerCase().includes(termo)
    // Pode adicionar mais campos para filtro se quiser, como validade etc.
  );

  exibirResinas(resinasFiltradas);
}

function cadastrarResina() {
  if (!isLoggedIn) {
    Swal.fire({
      icon: 'warning',
      title: 'Atenção!',
      text: 'Faça login para cadastrar resinas.',
      confirmButtonText: 'Ok',
    });
    return;
  }

  const nome = document.getElementById('nome').value.trim();
  const cor = document.getElementById('cor').value.trim();
  const validade = document.getElementById('validade').value.trim();

  const imagens = Array.from(document.querySelectorAll('.imagem-url-input'))
    .map(input => input.value.trim())
    .filter(url => url && isUrlValida(url));

  const compras = Array.from(document.querySelectorAll('.compra-url-input'))
    .map(input => input.value.trim())
    .filter(url => url && isUrlValida(url));

  const pesosPotes = [];
  document.querySelectorAll('.pote-peso-input').forEach(input => {
    const peso = parseFloat(input.value.trim());
    if (!isNaN(peso) && peso > 0) pesosPotes.push(peso);
  });

  if (!nome || !cor || !validade || pesosPotes.length === 0 || imagens.length === 0 || compras.length === 0) {
    Swal.fire({
      icon: 'warning',
      title: 'Atenção!',
      text: 'Preencha todos os campos corretamente.',
      confirmButtonText: 'Ok',
    });
    return;
  }

  const resina = {
    nome,
    cor,
    dataValidade: validade,
    quantidadePotes: pesosPotes.length,
    pesosPotes,
    imagens,
    compras
  };

  console.log('Dados enviados para cadastro:', JSON.stringify(resina));

  fetch('http://localhost:8080/api/resinas', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(resina)
  })
  .then(response => {
    if (!response.ok) {
      return response.json().then(error => {
        throw new Error(error.mensagem || 'Erro desconhecido: ' + response.statusText);
      });
    }
    return response.json();
  })
  .then(data => {
    console.log('Resina cadastrada, dados retornados:', data);
    Swal.fire({
      icon: 'success',
      title: 'Confirmado!',
      text: 'Resina cadastrada com sucesso!',
      confirmButtonText: 'Ok',
    });
    limparCamposCadastro(); // Verifique se isso causa o erro
    buscarTodasResinas();   // Verifique se isso causa o erro
  })
  .catch(error => {
    Swal.fire({
      icon: 'error',
      title: 'Erro!',
      text: error.message,
      confirmButtonText: 'Ok',
    });
  });

  const content = document.querySelector('.content');
  if (content) {
    content.removeAttribute('aria-hidden');
    content.removeAttribute('inert');
  }
}

document.getElementById("compra").addEventListener("keydown", function(event) {
  if (event.key === "Enter") {
    cadastrarResina();
  }
});

let resinasDisponiveis = [];

function buscarTodasResinas() {
  fetch('http://localhost:8080/api/resinas')
    .then(response => {
      if (!response.ok) throw new Error('Erro ao buscar resinas');
      return response.json();
    })
    .then(resinas => {
      resinasDisponiveis = resinas;
      exibirResinas(resinasDisponiveis);
    })
    .catch(error => console.error('Erro ao carregar resinas:', error));
}

function exibirResinas(resinas) {
  const container = document.getElementById('resinas-lista');
  container.innerHTML = '';

  if (resinas.length === 0) {
    container.innerHTML = '<p>Nenhuma resina encontrada.</p>';
    return;
  }

  resinas.forEach(resina => {
    const card = document.createElement('div');
    card.classList.add('product-card');
    const mainImageUrl = (resina.imagens && resina.imagens.length > 0) ? resina.imagens[0] : '';
    card.innerHTML = `
      <div class="main-image-display">
        <img src="${mainImageUrl}" alt="${resina.nome}" class="product-image">
      </div>
      <h3>${resina.nome}</h3>
      <p>Cor: ${resina.cor}</p>
      <p>Validade: ${resina.dataValidade || '---'}</p>
      <p>Quantidade de potes: ${resina.quantidadePotes || 0}</p>
      <p>Peso total dos potes (g): ${resina.totalPesos || '---'}</p>
      <div class="links-container">
        ${(resina.compras || []).map((url, i) => 
          `<a href="${url}" target="_blank" rel="noopener noreferrer">Comprar ${i + 1}</a>`
        ).join(' ')}
      </div>
      <div class="actions-container">
        <button onclick="abrirModalEdicao('${encodeURIComponent(resina.nome)}', '${btoa(JSON.stringify(resina))}')">Editar</button>
        <button onclick="removerResinaPorNome('${encodeURIComponent(resina.nome)}')">Remover</button>
      </div>
    `;
    container.appendChild(card);
  });
}

function limparCamposCadastro() {
  document.getElementById('nome').value = '';
  document.getElementById('cor').value = '';
  document.getElementById('validade').value = '';
  document.getElementById('quantidade').value = '';

  const potesContainer = document.getElementById('potes-pesos-container'); // Corrigido
  if (potesContainer) {
    potesContainer.innerHTML = `
      <label>Peso do Pote (1) em gramas:
        <input type="number" class="pote-peso-input" placeholder="Ex: 250" step="0.01" min="0" />
      </label>
    `;
  } else {
    console.error('Elemento potes-pesos-container não encontrado.');
  }

  const imagensContainer = document.getElementById('imagens-container');
  if (imagensContainer) {
    imagensContainer.innerHTML = `
      <label>URL da Imagem (1):
        <input type="url" class="imagem-url-input" placeholder="https://exemplo.com/imagem1.jpg" oninput="previewAllImages()" />
      </label>
    `;
  } else {
    console.error('Elemento imagens-container não encontrado.');
  }

  const comprasContainer = document.getElementById('compras-container');
  if (comprasContainer) {
    comprasContainer.innerHTML = `
      <label>Link de Compra (1):
        <input type="url" class="compra-url-input" placeholder="https://exemplo.com/compra1" />
      </label>
    `;
  } else {
    console.error('Elemento compras-container não encontrado.');
  }

  const previewContainer = document.getElementById('preview-container');
  if (previewContainer) {
    previewContainer.innerHTML = '';
  } else {
    console.error('Elemento preview-container não encontrado.');
  }

  atualizarQuantidade();
}
  if (localStorage.getItem("logado") !== "true") {
    window.location.href = "index.html";
  }


let isLoggedIn = false;

function isUrlValida(url) {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
}

function fazerLogin() {
  const username = document.getElementById('login-username').value.trim();
  const password = document.getElementById('login-password').value.trim();
  const errorMessage = document.getElementById('error-login'); // Corrigido aqui

  if (username === 'admin' && password === 'indigo2025') {
    isLoggedIn = true;
    document.getElementById('login-section').style.display = 'none';
    document.getElementById('cadastro-section').style.display = 'block';
    document.querySelector('.search-bar').style.display = 'flex';
    buscarTodosProdutos();
  } else {
    errorMessage.textContent = 'Usuário ou senha inválidos.';
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
      const sidebar = document.getElementById('sidebar');
      sidebar.classList.remove('open');
      console.log("Sidebar inicializado como fechado");
});

  function logout() {
    localStorage.removeItem("logado");
    window.location.href = "index.html";
  }


function limparCamposCadastro() {
  document.getElementById('nome').value = '';
  document.getElementById('cor').value = '';
  document.getElementById('fabricante').value = '';
  document.getElementById('preco').value = '';
  document.getElementById('quantidade').value = '';
  document.getElementById('imagens-container').innerHTML = `
    <label>URL da Imagem (1):
      <input type="url" class="imagem-url-input" placeholder="https://exemplo.com/imagem1.jpg" oninput="previewAllImages()">
    </label>`;
  document.getElementById('rolos-container').innerHTML = `
    <label>Peso do Rolo (1) em gramas:
      <input type="number" class="rolo-peso-input" placeholder="Ex: 500" step="0.01" min="0">
    </label>`;
  document.getElementById('preview-container').innerHTML = '';
  document.getElementById('compras-container').innerHTML = `
    <label>Link de Compra (1):
      <input type="url" class="compra-url-input" placeholder="https://exemplo.com/compra1">
    </label>`;
}

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
  novoInput.innerHTML = `URL da compra:
    <input type="url" class="link-url-input" placeholder="https://exemplo.com/compra.jpg" oninput="previewAllImages()">`;
  container.appendChild(novoInput);
}

function adicionarCampoRolo() {
  const container = document.getElementById('rolos-container');
  const index = container.querySelectorAll('.rolo-peso-input').length + 1;
  const novoInput = document.createElement('label');
  novoInput.innerHTML = `Peso do Rolo (${index}) em gramas:
    <input type="number" class="rolo-peso-input" placeholder="Ex: 500" step="0.01" min="0">`;
  container.appendChild(novoInput);
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
  const previewContainerModal = document.getElementById('edit-preview-container');
  previewContainerModal.innerHTML = '';
  document.querySelectorAll('.imagem-url-input-modal').forEach(input => {
    const url = input.value.trim();
    if (url && isUrlValida(url)) {
      const img = document.createElement('img');
      img.src = url;
      img.alt = 'Prévia da imagem';
      img.classList.add('image-preview');
      img.style.maxWidth = '200px';
      img.style.margin = '5px';
      previewContainerModal.appendChild(img);
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

function adicionarCampoRoloModal() {
  const rolosContainerModal = document.getElementById('edit-rolos-container');
  const index = rolosContainerModal.querySelectorAll('.rolo-peso-input-modal').length + 1;
  const newLabel = document.createElement('label');
  newLabel.innerHTML = `
    Peso do Rolo (${index}) em gramas:
    <input type="number" class="rolo-peso-input-modal" placeholder="Ex: 500" step="0.01" min="0">
  `;
  rolosContainerModal.appendChild(newLabel);
  rolosContainerModal.appendChild(document.createElement('br'));
}

function abrirModalEdicao(nomeOriginal, produtoDataBase64) {
  if (!isLoggedIn) {
    Swal.fire({
      icon: 'warning',
      title: 'Atenção!',
      text: 'Faça login para editar produtos.',
      confirmButtonText: 'Ok',
    });
    return;
  }

  try {
    const produtoData = JSON.parse(atob(produtoDataBase64));
    const modal = document.getElementById('editProductModal');
    modal.style.display = 'block';

    document.getElementById('edit-original-nome').value = decodeURIComponent(nomeOriginal);
    document.getElementById('edit-nome').value = produtoData.nome || '';
    document.getElementById('edit-cor').value = produtoData.cor || '';
    document.getElementById('edit-fabricante').value = produtoData.fabricante || '';
    document.getElementById('edit-preco').value = produtoData.preco || '';
    document.getElementById('edit-quantidade').value = produtoData.quantidadeRolos || '';

    // Preenche campos de imagem, compra e rolos (como você já fazia antes)
    // 👇 os trechos abaixo do try/catch permanecem iguais ao seu código anterior
    // (sem mudanças)

    const imagensContainerModal = document.getElementById('edit-imagens-container');
    imagensContainerModal.innerHTML = '';
    const imagens = (produtoData.imagens && produtoData.imagens.length > 0) ? produtoData.imagens : [''];
    imagens.forEach((url, index) => {
      const newLabel = document.createElement('label');
      newLabel.innerHTML = `
        URL da Imagem (${index + 1}):
        <input type="url" class="imagem-url-input-modal" value="${url}" oninput="previewImagesModal()">
      `;
      imagensContainerModal.appendChild(newLabel);
      imagensContainerModal.appendChild(document.createElement('br'));
    });

    const comprasContainerModal = document.getElementById('edit-compras-container');
    comprasContainerModal.innerHTML = '';
    const compras = (produtoData.compras && produtoData.compras.length > 0) ? produtoData.compras : [''];
    compras.forEach((url, index) => {
      const newLabel = document.createElement('label');
      newLabel.innerHTML = `
        Link de Compra (${index + 1}):
        <input type="url" class="compra-url-input-modal" value="${url}">
      `;
      comprasContainerModal.appendChild(newLabel);
      comprasContainerModal.appendChild(document.createElement('br'));
    });

    const rolosContainerModal = document.getElementById('edit-rolos-container');
    rolosContainerModal.innerHTML = '';
    const rolos = (produtoData.rolosPesos && produtoData.rolosPesos.length > 0) ? produtoData.rolosPesos : [0];
    rolos.forEach((peso, index) => {
      const newLabel = document.createElement('label');
      newLabel.innerHTML = `
        Peso do Rolo (${index + 1}) em gramas:
        <input type="number" class="rolo-peso-input-modal" value="${peso}" step="0.01" min="0">
      `;
      rolosContainerModal.appendChild(newLabel);
      rolosContainerModal.appendChild(document.createElement('br'));
    });

    previewImagesModal();

  } catch (e) {
    console.error('Erro ao decodificar dados do produto:', e);
    Swal.fire({
      icon: 'error',
      title: 'Erro!',
      text: 'Falha ao carregar os dados do produto para edição.',
      confirmButtonText: 'Ok',
    });
  }
}

function fecharModal() {
    // Lógica para fechar o modal, ex.: esconder o modal
    document.getElementById('editProductModal').style.display = 'none';
}

function atualizarProdutoPeloNome() {
  if (!isLoggedIn) {
    Swal.fire({
      icon: 'warning',
      title: 'Atenção!',
      text: 'Faça login para atualizar produtos.',
      confirmButtonText: 'Ok',
    });
    return;
  }

  const nomeOriginal = document.getElementById('edit-original-nome').value.trim();
  const nome = document.getElementById('edit-nome').value.trim();
  const cor = document.getElementById('edit-cor').value.trim();
  const fabricante = document.getElementById('edit-fabricante').value.trim();
  const preco = parseFloat(document.getElementById('edit-preco').value.trim());
  const quantidade = parseInt(document.getElementById('edit-quantidade').value.trim(), 10);

  const imagens = [];
  const compras = [];
  const rolosPesos = [];
  let urlInvalida = false;

  document.querySelectorAll('.imagem-url-input-modal').forEach(input => {
    const url = input.value.trim();
    if (url && isUrlValida(url) && !imagens.includes(url)) { // Remove duplicatas
      imagens.push(url);
    } else if (url && !isUrlValida(url)) {
      urlInvalida = true;
    }
  });

  document.querySelectorAll('.compra-url-input-modal').forEach(input => {
    const url = input.value.trim();
    if (url && isUrlValida(url)) compras.push(url);
    else if (url) urlInvalida = true;
  });

  document.querySelectorAll('.rolo-peso-input-modal').forEach(input => {
    const peso = parseFloat(input.value.trim());
    if (!isNaN(peso) && peso > 0) rolosPesos.push(peso);
  });

  const imagensUnicas = [...new Set(imagens)]; // Garante unicidade extra
  const comprasUnicas = [...new Set(compras)];

  if (!nome || !cor || !fabricante || isNaN(preco) || imagensUnicas.length === 0 || comprasUnicas.length === 0 || urlInvalida || rolosPesos.length === 0) {
    Swal.fire({
      icon: 'warning',
      title: 'Atenção!',
      text: 'Preencha corretamente todos os campos do modal e use URLs válidas.',
      confirmButtonText: 'Ok',
    });
    return;
  }

  const produtoAtualizado = {
    nome,
    cor,
    fabricante,
    preco,
    quantidadeRolos: rolosPesos.length,
    rolosPesos,
    imagens: imagensUnicas,
    compras: comprasUnicas,
  };

  fetch(`http://localhost:8080/api/produtos/nome/${encodeURIComponent(nomeOriginal)}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(produtoAtualizado),
  })
    .then(response => {
      if (response.ok) {
        Swal.fire({
          icon: 'success',
          title: 'Confirmado!',
          text: 'Produto atualizado com sucesso!',
          confirmButtonText: 'Ok',
        });
        fecharModal();
        buscarTodosProdutos();
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

function removerProdutoPorNome(nome) {
  if (!isLoggedIn) {
    Swal.fire({
      icon: 'warning',
      title: 'Erro!',
      text: 'Faça login para remover produtos.',
      confirmButtonText: 'Ok',
    });
    return;
  }

  const decodedNome = decodeURIComponent(nome);

  Swal.fire({
    title: `Tem certeza que deseja remover o produto com nome: ${decodedNome}?`,
    icon: 'warning',
    showCancelButton: true,
    confirmButtonText: 'Sim, remover',
    cancelButtonText: 'Cancelar',
    reverseButtons: true,
  }).then((result) => {
    if (result.isConfirmed) {
      fetch(`http://localhost:8080/api/produtos/nome/${encodeURIComponent(decodedNome)}`, {
        method: 'DELETE',
      })
      .then(response => {
        if (response.ok) {
          Swal.fire({
            icon: 'success',
            title: 'Confirmado!',
            text: 'Produto removido com sucesso!',
            confirmButtonText: 'Ok',
          });
          buscarTodosProdutos();
        } else if (response.status === 404) {
          Swal.fire({
            icon: 'warning',
            title: 'Atenção!',
            text: 'Produto não encontrado.',
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
              text: 'Erro ao remover produto.',
              confirmButtonText: 'Ok',
            });
          });
        }
      })
      .catch(error => console.error('Erro:', error));
    }
  });
}


function buscarProdutoPorNome() {
  const termo = document.getElementById('busca-nome').value.trim().toLowerCase();

  const produtosFiltrados = produtosDisponiveis.filter(produto =>
    produto.nome.toLowerCase().includes(termo) ||
    produto.cor.toLowerCase().includes(termo) ||
    produto.fabricante.toLowerCase().includes(termo)
  );

  exibirProdutos(produtosFiltrados);
}

function cadastrarProduto() {
  if (!isLoggedIn) {
    Swal.fire({
      icon: 'warning',
      title: 'Atenção!',
      text: 'Faça login para cadastrar produtos.',
      confirmButtonText: 'Ok',
    });
    return;
  }

  const nome = document.getElementById('nome').value.trim();
  const cor = document.getElementById('cor').value.trim();
  const fabricante = document.getElementById('fabricante').value.trim();
  const preco = parseFloat(document.getElementById('preco').value.trim());
  const quantidade = parseInt(document.getElementById('quantidade').value.trim(), 10);

  const imagens = [];
  const compras = [];
  const rolosPesos = [];
  let urlInvalida = false;

  document.querySelectorAll('.imagem-url-input').forEach(input => {
    const url = input.value.trim();
    if (url && isUrlValida(url) && !imagens.includes(url)) {
      imagens.push(url);
    } else if (url && !isUrlValida(url)) {
      urlInvalida = true;
    }
  });

  document.querySelectorAll('.compra-url-input').forEach(input => {
    const url = input.value.trim();
    if (url && isUrlValida(url)) compras.push(url);
    else if (url) urlInvalida = true;
  });

  document.querySelectorAll('.rolo-peso-input').forEach(input => {
    const peso = parseFloat(input.value.trim());
    if (!isNaN(peso) && peso > 0) rolosPesos.push(peso);
  });

  if (!nome || !cor || !fabricante || isNaN(preco) || imagens.length === 0 || compras.length === 0 || urlInvalida || rolosPesos.length === 0) {
    Swal.fire({
      icon: 'warning',
      title: 'Atenção!',
      text: 'Preencha todos os campos corretamente.',
      confirmButtonText: 'Ok',
    });
    return;
  }

  const produto = {
    nome,
    cor,
    fabricante, // Corrigido de 'idioma' para 'fabricante'
    preco,
    quantidadeRolos: rolosPesos.length,
    rolosPesos,
    imagens,
    compras,
  };

  fetch('http://localhost:8080/api/produtos', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(produto),
  })
    .then(response => {
      if (response.ok) {
        Swal.fire({
          icon: 'success',
          title: 'Confirmado!',
          text: 'Produto cadastrado com sucesso!',
          confirmButtonText: 'Ok',
        });
        limparCamposCadastro();
        buscarTodosProdutos();
      } else {
        response.json().then(error => {
          Swal.fire({
            icon: 'warning',
            title: 'Atenção!',
            text: 'Erro ao cadastrar: ' + (error.mensagem || response.statusText),
            confirmButtonText: 'Ok',
          });
        });
      }
    })
    .catch(error => console.error('Erro de rede:', error));
}

document.getElementById("compra").addEventListener("keydown", function(event) {
  if (event.key === "Enter") {
    cadastrarProduto();
  }
});

let produtosDisponiveis = [];

function buscarTodosProdutos() {
  fetch('http://localhost:8080/api/produtos')
    .then(response => {
      if (!response.ok) throw new Error('Erro ao buscar produtos');
      return response.json();
    })
    .then(produtos => {
      produtosDisponiveis = produtos;
      exibirProdutos(produtosDisponiveis);
    })
    .catch(error => console.error('Erro ao carregar produtos:', error));
}

function buscarTodosProdutos() {
  fetch('http://localhost:8080/api/produtos')
    .then(response => {
      if (!response.ok) throw new Error('Erro ao buscar produtos');
      return response.json();
    })
    .then(produtos => {
      console.log('Produtos recebidos:', produtos); // Add this
      produtosDisponiveis = produtos;
      exibirProdutos(produtosDisponiveis);
    })
    .catch(error => console.error('Erro ao carregar produtos:', error));
}

function exibirProdutos(produtos) {
  const container = document.getElementById('produtos-lista');
  container.innerHTML = '';

  if (produtos.length === 0) {
    container.innerHTML = '<p>Nenhum produto encontrado.</p>';
    return;
  }

  produtos.forEach(produto => {
    const card = document.createElement('div');
    card.classList.add('product-card');

    const mainImageUrl = (produto.imagens && produto.imagens.length > 0) ? produto.imagens[0] : '';

    // Convertemos os dados do produto para base64 seguro para HTML
    const produtoBase64 = btoa(JSON.stringify(produto));

    card.innerHTML = `
      <div class="main-image-display">
        <img src="${mainImageUrl}" alt="${produto.nome}" class="product-image">
      </div>
      <div class="thumbnails-container">
        ${(produto.imagens || []).map((url, i) => `
          <img src="${url}" alt="Thumbnail ${i + 1}" class="product-thumbnail ${i === 0 ? 'active-thumbnail' : ''}" onclick="changeMainImage(this)">
        `).join('')}
      </div>
      <h3>${produto.nome}</h3>
      <p>Cor: ${produto.cor}</p>
      <p>Fabricante: ${produto.fabricante}</p>
      <p>Gramatura: ${produto.gramas || '---'} g</p>
      <p>Preço: R$ ${produto.preco.toFixed(2)}</p>
      <div class="links-container">
        ${(produto.compras || []).map((url, i) => `
          <a href="${url}" target="_blank" rel="noopener noreferrer">Comprar ${i + 1}</a>
        `).join(' ')}
      </div>
      <div class="actions-container">
        <button onclick="abrirModalEdicao('${encodeURIComponent(produto.nome)}', '${produtoBase64}')">Editar</button>
        <button onclick="removerProdutoPorNome('${encodeURIComponent(produto.nome)}')">Remover</button>
      </div>
    `;
    container.appendChild(card);
  });
}

document.addEventListener('DOMContentLoaded', () => {
  const sidebar = document.querySelector('.sidebar');

  buscarTodosProdutos();

  const campoBusca = document.getElementById('busca-nome');
  if (campoBusca) {
    campoBusca.addEventListener('input', buscarProdutoPorNome);
  }
});
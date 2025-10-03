const API_URL = 'https://www.googleapis.com/books/v1/volumes?q=subject:love&maxResults=30';

const livrosLista = document.getElementById('livros-lista');
const pesquisaInput = document.getElementById('pesquisa-livros');
const livrosErro = document.getElementById('livros-erro');

// Modal elementos
const modal = document.getElementById('modal-livro');
const fecharModalBtn = document.getElementById('fechar-modal');
const modalImagem = document.getElementById('modal-imagem');
const modalTitulo = document.getElementById('modal-titulo');
const modalAutores = document.getElementById('modal-autores');
const modalEditora = document.getElementById('modal-editora');
const modalPaginas = document.getElementById('modal-paginas');
const modalDescricao = document.getElementById('modal-descricao');
const modalLink = document.getElementById('modal-link');

let livrosDados = [];

// Função para criar o card do livro
function criarCardLivro(livro) {
  const info = livro.volumeInfo || {};
  const titulo = info.title || 'Título não disponível';
  const autores = info.authors ? info.authors.join(', ') : 'Autor desconhecido';
  const imagem = info.imageLinks?.thumbnail
    ? info.imageLinks.thumbnail.replace('http:', 'https:')
    : 'images/livro-imagem.jpg';

  const div = document.createElement('div');
  div.classList.add('livro');

  div.innerHTML = `
    <img src="${imagem}" alt="${titulo}" loading="lazy" />
    <div class="livro-content">
        <h3>${titulo}</h3>
        <p>Autor: ${autores}</p>
    </div>
  `;

  // Ao clicar, abre o modal com detalhes
  div.addEventListener('click', () => abrirModal(livro));

  return div;
}

// Renderiza livros na tela
function renderizarLivros(livros) {
  livrosLista.innerHTML = '';

  if (livros.length === 0) {
    livrosErro.style.display = 'block';
    return;
  } else {
    livrosErro.style.display = 'none';
  }

  livros.forEach(livro => {
    const card = criarCardLivro(livro);
    livrosLista.appendChild(card);
  });
}

// Abre modal com detalhes do livro
function abrirModal(livro) {
  const info = livro.volumeInfo || {};

  modalImagem.src = info.imageLinks?.thumbnail
    ? info.imageLinks.thumbnail.replace('http:', 'https:')
    : 'images/livro-imagem.jpg';
  modalImagem.alt = info.title || 'Imagem do livro';

  modalTitulo.textContent = info.title || 'Título não disponível';
  modalAutores.textContent = info.authors ? info.authors.join(', ') : 'Autor desconhecido';
  modalEditora.textContent = info.publisher || 'Editora não disponível';
  modalPaginas.textContent = info.pageCount || 'N/A';
  modalDescricao.textContent = info.description
    ? info.description.replace(/(<([^>]+)>)/gi, '') // Remove tags HTML da descrição
    : 'Descrição não disponível.';
  modalLink.href = info.infoLink || '#';

  modal.style.display = 'block';
}

// Fecha modal
function fecharModal() {
  modal.style.display = 'none';
}

// Fecha modal ao clicar fora do conteúdo
window.addEventListener('click', (event) => {
  if (event.target === modal) {
    fecharModal();
  }
});

// Fecha modal ao clicar no botão fechar
fecharModalBtn.addEventListener('click', fecharModal);

// Carrega livros da API Google Books
async function carregarLivros() {
  try {
    const response = await fetch(API_URL);
    if (!response.ok) throw new Error('Erro ao buscar livros');
    const data = await response.json();
    livrosDados = data.items || [];
    renderizarLivros(livrosDados);
  } catch (error) {
    livrosLista.innerHTML = `<p class="error-message">Erro ao carregar livros. Tente novamente mais tarde.</p>`;
    console.error(error);
  }
}

// Filtra livros pelo input de pesquisa
pesquisaInput.addEventListener('input', () => {
  const termo = pesquisaInput.value.toLowerCase();
  const livrosFiltrados = livrosDados.filter(livro => {
    const titulo = livro.volumeInfo?.title?.toLowerCase() || '';
    return titulo.includes(termo);
  });
  renderizarLivros(livrosFiltrados);
});

// Validação do formulário
const formContato = document.getElementById('form-contato');
const inputNome = document.getElementById('nome');
const inputEmail = document.getElementById('email');
const erroNome = document.getElementById('erro-nome');
const erroEmail = document.getElementById('erro-email');

function validarEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

formContato.addEventListener('submit', (event) => {
  event.preventDefault();

  let valido = true;

  erroNome.textContent = '';
  erroEmail.textContent = '';

  if (inputNome.value.trim() === '') {
    erroNome.textContent = 'Por favor, insira seu nome.';
    valido = false;
  }

  if (inputEmail.value.trim() === '') {
    erroEmail.textContent = 'Por favor, insira seu e-mail.';
    valido = false;
  } else if (!validarEmail(inputEmail.value.trim())) {
    erroEmail.textContent = 'Formato de e-mail inválido.';
    valido = false;
  }

  if (valido) {
    alert(`Obrigado, ${inputNome.value.trim()}! Seu contato foi enviado.`);
    formContato.reset();
  }
});

// Carrega livros ao iniciar a página
window.addEventListener('load', carregarLivros);

const cardContainer = document.querySelector(".card-container");
const searchInput = document.querySelector("header div input");
let dados = [];

// Carrega os dados do JSON quando a página é carregada
window.addEventListener('load', async () => {
    try {
        const resposta = await fetch("data.json");
        dados = await resposta.json();
        renderizarCards(dados); // Exibe todos os cards inicialmente
    } catch (error) {
        console.error("Erro ao carregar os dados:", error);
    }
});

// Adiciona um evento que chama a função de busca ao pressionar a tecla ENTER
searchInput.addEventListener('keydown', (event) => {
    if (event.key === 'Enter') {
        event.preventDefault(); // Evita o comportamento padrão do Enter (como submeter um formulário)
        iniciarBusca();
    }
});

function normalizarTexto(texto) {
    return texto.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
}

function iniciarBusca() {
    const termoBusca = normalizarTexto(searchInput.value);
    const resultados = dados.filter(dado => {
        const nomeNormalizado = normalizarTexto(dado.nome);
        const descricaoNormalizada = normalizarTexto(dado.descricao);

        return nomeNormalizado.includes(termoBusca) || descricaoNormalizada.includes(termoBusca);
    });
    renderizarCards(resultados);
}

function renderizarCards(dados) {
    cardContainer.innerHTML = ""; // Limpa os cards existentes

    if (dados.length === 0) {
        cardContainer.innerHTML = "<p>Nenhum resultado encontrado.</p>";
        return;
    }

    dados.forEach((dado, index) => {
        let article = document.createElement("article");
        article.classList.add('card'); // Adiciona a classe base do card

        article.innerHTML = `
            <div class="card-header">
                <h2>${dado.nome}</h2>
                <span class="card-year">${dado.data_criacao}</span>
            </div>
            <p class="card-description">${dado.descricao}</p>
            <a href="${dado.link}" target="_blank" class="card-link">
                Saiba mais <span>→</span>
            </a>
        `;
        cardContainer.appendChild(article);

        // Adiciona a classe .visible com um atraso para criar o efeito escalonado
        setTimeout(() => {
            article.classList.add('visible'); // A classe .visible agora funciona com .card
        }, index * 100); // Atraso de 100ms entre cada card
    });
}
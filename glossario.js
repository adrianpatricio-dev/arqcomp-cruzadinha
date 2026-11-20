// =========================================================
// GLOSSÁRIO - explica cada termo da cruzadinha
// Tem uma busca por texto e botões para filtrar por categoria.
// =========================================================


// ===== PARTE A: os dados do glossário =====

// Cada objeto é um termo: o nome, o significado da sigla (quando tem),
// a categoria (usada nos filtros) e a explicação
const glossario = [
    { termo: "CPU", sigla: "Central Processing Unit · Unidade Central de Processamento", categoria: "Processador",
      texto: "É o \"cérebro\" do computador: busca as instruções dos programas na memória, entende o que elas pedem e executa. Dentro dela ficam a ULA, a UC e os registradores." },
    { termo: "ULA", sigla: "Unidade Lógica e Aritmética", categoria: "Processador",
      texto: "Parte da CPU que faz as contas (soma, subtração...) e as comparações lógicas (maior, menor, igual). É a \"calculadora\" do processador." },
    { termo: "UC", sigla: "Unidade de Controle", categoria: "Processador",
      texto: "Parte da CPU que comanda tudo: busca cada instrução, decodifica e manda sinais para a ULA, os registradores e a memória agirem na hora certa." },
    { termo: "Registradores", sigla: "", categoria: "Processador",
      texto: "Memórias minúsculas dentro da CPU e as mais rápidas de todas. Guardam os dados e endereços que estão sendo usados naquele instante." },
    { termo: "RAM", sigla: "Random Access Memory · memória de acesso aleatório", categoria: "Memórias",
      texto: "Memória principal, onde ficam os programas abertos e os dados deles. É volátil: perde tudo quando o computador desliga." },
    { termo: "ROM", sigla: "Read Only Memory · memória somente de leitura", categoria: "Memórias",
      texto: "Memória gravada na fábrica, que não perde os dados sem energia. Guarda programas fixos, como o que liga o computador (firmware)." },
    { termo: "EEPROM", sigla: "Electrically Erasable Programmable ROM", categoria: "Memórias",
      texto: "Tipo de ROM que pode ser apagada e regravada por sinais elétricos, byte a byte. Usada para guardar pequenas configurações." },
    { termo: "Flash", sigla: "", categoria: "Memórias",
      texto: "Memória não volátil, parecida com a EEPROM, mas apagada e regravada em blocos, o que a deixa mais rápida e barata. Está em pendrives, cartões SD e SSDs." },
    { termo: "Cache", sigla: "", categoria: "Memórias",
      texto: "Memória pequena e muito rápida entre a CPU e a RAM. Guarda cópias dos dados mais usados para a CPU não ficar esperando a RAM. É dividida em níveis (L1, L2, L3)." },
    { termo: "Memória de massa", sigla: "armazenamento", categoria: "Memórias",
      texto: "Armazenamento permanente e de grande capacidade, como HD e SSD. É mais lenta que a RAM, mas guarda os arquivos mesmo sem energia." },
    { termo: "DMA", sigla: "Direct Memory Access · acesso direto à memória", categoria: "Barramentos e transferência",
      texto: "Recurso que deixa um dispositivo (disco, placa de rede...) trocar dados direto com a memória, sem a CPU copiar byte por byte. Assim a CPU fica livre para outras tarefas." },
    { termo: "Address bus", sigla: "barramento de endereço", categoria: "Barramentos e transferência",
      texto: "Conjunto de fios que leva o endereço: indica em qual posição da memória (ou de qual dispositivo) a CPU quer ler ou escrever. Vai só da CPU para fora." },
    { termo: "Data bus", sigla: "barramento de dados", categoria: "Barramentos e transferência",
      texto: "Conjunto de fios que transporta os dados lidos ou escritos entre CPU, memória e dispositivos. Funciona nos dois sentidos." },
    { termo: "Microcontrolador", sigla: "", categoria: "Processador",
      texto: "Um computador inteiro num só chip: processador, memória (RAM e Flash/EEPROM) e entradas e saídas. Usado em sistemas embarcados, como Arduino e micro-ondas." },
    { termo: "Dual core", sigla: "núcleo duplo", categoria: "Processador",
      texto: "Processador com dois núcleos no mesmo chip. Cada núcleo processa sozinho, então duas tarefas podem rodar ao mesmo tempo." },
    { termo: "Quad core", sigla: "núcleo quádruplo", categoria: "Processador",
      texto: "Processador com quatro núcleos no mesmo chip, que podem trabalhar em paralelo." }
];

// Categorias dos botões de filtro ("Todos" mostra tudo)
const categorias = ["Todos", "Processador", "Memórias", "Barramentos e transferência"];


// ===== PARTE B: elementos da página e estado do filtro =====

const listaGlossario = document.getElementById("lista-glossario");
const buscaGlossario = document.getElementById("busca-glossario");
const filtrosGlossario = document.getElementById("filtros-glossario");
const avisoVazio = document.getElementById("glossario-vazio");

let categoriaEscolhida = "Todos";  // qual botão de filtro está marcado


// ===== PARTE C: funções =====

// Deixa o texto em minúsculas e sem acentos, para a busca achar "memoria" e "Memória"
// (normalize("NFD") separa a letra do acento, e o replace apaga os acentos)
function simplificar(texto) {
    return texto.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "");
}

// Transforma a categoria num nome de classe CSS, para cada uma ter sua cor
// "Barramentos e transferência" vira "cat-barramentos"
function classeDaCategoria(categoria) {
    return "cat-" + simplificar(categoria).split(" ")[0];
}

// Cria o cartão (HTML) de um termo
function criarCartao(item) {
    const cartao = document.createElement("article");
    cartao.classList.add("termo-glossario", classeDaCategoria(item.categoria));

    const etiqueta = document.createElement("span");
    etiqueta.classList.add("etiqueta");
    etiqueta.textContent = item.categoria;

    const titulo = document.createElement("h3");
    titulo.textContent = item.termo;

    cartao.appendChild(etiqueta);
    cartao.appendChild(titulo);

    // Só mostra a linha da sigla se o termo tiver uma
    if (item.sigla !== "") {
        const sigla = document.createElement("p");
        sigla.classList.add("sigla");
        sigla.textContent = item.sigla;
        cartao.appendChild(sigla);
    }

    const texto = document.createElement("p");
    texto.textContent = item.texto;
    cartao.appendChild(texto);

    return cartao;
}

// Apaga os cartões e desenha só os que combinam com a busca e o filtro
function mostrarGlossario() {
    listaGlossario.innerHTML = "";
    const busca = simplificar(buscaGlossario.value);
    let quantos = 0;

    for (let i = 0; i < glossario.length; i++) {
        const item = glossario[i];

        // Combina com o filtro? ("Todos" sempre combina)
        const passaFiltro = categoriaEscolhida === "Todos" || item.categoria === categoriaEscolhida;

        // Combina com a busca? Procura no nome, na sigla e na categoria
        const textoCompleto = simplificar(item.termo + " " + item.sigla + " " + item.categoria);
        const passaBusca = textoCompleto.includes(busca);

        if (passaFiltro && passaBusca) {
            listaGlossario.appendChild(criarCartao(item));
            quantos++;
        }
    }

    // Nenhum termo encontrado: mostra o aviso
    avisoVazio.hidden = quantos > 0;
}


// ===== PARTE D: botões de filtro e busca =====

for (let i = 0; i < categorias.length; i++) {
    const botao = document.createElement("button");
    botao.classList.add("filtro");
    botao.textContent = categorias[i];
    if (categorias[i] === categoriaEscolhida) {
        botao.classList.add("ativo");
    }

    botao.addEventListener("click", function () {
        // Desmarca o botão antigo e marca o clicado
        filtrosGlossario.querySelector(".ativo").classList.remove("ativo");
        botao.classList.add("ativo");

        categoriaEscolhida = categorias[i];
        mostrarGlossario();
    });

    filtrosGlossario.appendChild(botao);
}

// A cada letra digitada na busca, a lista é refeita
buscaGlossario.addEventListener("input", mostrarGlossario);

// Desenha o glossário completo pela primeira vez
mostrarGlossario();
